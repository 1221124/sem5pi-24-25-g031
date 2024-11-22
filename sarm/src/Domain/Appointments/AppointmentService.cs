using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.Surgeries;
using DDDNetCore.Domain.SurgeryRooms;
using DDDNetCore.PrologIntegrations;
using Domain.DbLogs;
using Domain.OperationTypes;
using Domain.Shared;

namespace DDDNetCore.Domain.Appointments
{
    public class AppointmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAppointmentRepository _appointmentRepository;

        public AppointmentService(IAppointmentRepository appointmentRepository, IUnitOfWork unitOfWork)
        {
            _appointmentRepository = appointmentRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<List<Appointment>> GetByRoomAndDateAsync(SurgeryRoomNumber surgeryRoomNumber, DateTime date)
        {
            return await _appointmentRepository.GetByRoomAndDateAsync(surgeryRoomNumber, date);
        }

        public async Task<List<Appointment>> GetAll()
        {
            return await _appointmentRepository.GetAllAsync();
        }

        public async Task<Appointment> AddAsync(CreatingAppointmentDto appointment)
        {
            try
            {
                if (appointment == null)
                    throw new ArgumentNullException(nameof(appointment));

                var all = await _appointmentRepository.GetAllAsync();
                var newAppointment = AppointmentMapper.ToEntity(appointment, all.Count + 1);

                await _appointmentRepository.AddAsync(newAppointment);
                await _unitOfWork.CommitAsync();

                return newAppointment;

                // if (operationRequest.Any(x => x.Id.ToString() == appointment.OperationRequestId.Value))
                // {
                //     var op = await _operationRequestService.GetFilteredAsync(
                //         appointment.OperationRequestId.Value,
                //         null, null, null, null, null, null
                //     );

                //     if (op == null || op.Count != 1) return null;
                    
                //     var all = await _appointmentRepository.GetAllAsync();

                //     var newAppointment = AppointmentMapper.ToEntity(appointment, all.Count + 1);

                //     await _appointmentRepository.AddAsync(newAppointment);
                //     await _unitOfWork.CommitAsync();

                //     //await _logService.AddAsync(new DbLog("Appointment", "Add", appointment.Id.AsString()));   
                //     return newAppointment;
                // }
            }
            catch (Exception)
            {
                return null;
            }
            
        }

        public async Task<List<string>> CreateAppointmentsAutomatically(SurgeryRoomNumber surgeryRoomNumber, DateTime dateTime, PrologResponse response)
        {
            try
            {  
                var opRequestsIds = new List<string>();

                var surgeryRoom = SurgeryRoomNumberUtils.ToString(surgeryRoomNumber);

                //appointmentsGenerated = [(slotBegginingInMinutes, slotEndInHours, operationRequestId), (..., ..., ...), ...],
                var appointmentsGenerated = response.AppointmentsGenerated;
                var appointments = appointmentsGenerated.Split("), (");
                appointments[0] = appointments[0].Substring(2);
                appointments[appointments.Length - 1] = appointments[appointments.Length - 1].Substring(0, appointments[appointments.Length - 1].Length - 3);

                foreach (var appointment in appointments)
                {
                    var appointmentData = appointment.Split(", ");

                    var startInMinutes = appointmentData[0];
                    var endDateInMinutes = appointmentData[1];
                    var id = appointmentData[2];

                    if (id.StartsWith("ap")) continue;

                    var operationRequestId = new OperationRequestId(id);

                    int hours = int.Parse(startInMinutes) / 60;
                    int minutes = int.Parse(startInMinutes) % 60;
                    var startInHours = hours.ToString("D2") + ":" + minutes.ToString("D2");

                    hours = int.Parse(endDateInMinutes) / 60;
                    minutes = int.Parse(endDateInMinutes) % 60;
                    var endDateInHours = hours.ToString("D2") + ":" + minutes.ToString("D2");

                    var startTime = DateTime.ParseExact(startInHours, "HH:mm", null);
                    var endTime = DateTime.ParseExact(endDateInHours, "HH:mm", null);

                    var start = dateTime.Date.Add(startTime.TimeOfDay);
                    var end = dateTime.Date.Add(endTime.TimeOfDay);

                    var slot = new Slot(start, end);

                    var creatingAppointment = new CreatingAppointmentDto(operationRequestId, surgeryRoomNumber, slot);

                    var all = await _appointmentRepository.GetAllAsync();
                    var newAppointment = AppointmentMapper.ToEntity(creatingAppointment, all.Count + 1);

                    await _appointmentRepository.AddAsync(newAppointment);

                    opRequestsIds.Add(id);
                }

                await _unitOfWork.CommitAsync();

                return opRequestsIds;

            }
            catch (Exception)
            {
                return new List<string>();
                throw new Exception("Error creating appointments automatically");
            }   
        }

        // public async Task<Appointment> DeleteAsync(AppointmentId id)
        // {
        //     try
        //     {
        //         var appointment = await _appointmentRepository.GetByIdAsync(id);
        //
        //         if (appointment == null)
        //             return null;
        //
        //         await _appointmentRepository.Remove(appointment);
        //         await _unitOfWork.CommitAsync();
        //
        //         return appointment;
        //     }
        //     catch (Exception)
        //     {
        //         return null;
        //     }
        // }
    }
}
            