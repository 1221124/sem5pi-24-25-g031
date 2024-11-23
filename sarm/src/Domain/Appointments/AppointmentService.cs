using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.SurgeryRooms;
using DDDNetCore.PrologIntegrations;
using Domain.Shared;
using Domain.Staffs;

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
                var newAppointment = AppointmentMapper.ToEntity(appointment);

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

        public async Task<(List<RequestCode> requestCodes, List<AppointmentNumber> appointmentNumbers)> CreateAppointmentsAutomatically(SurgeryRoomNumber surgeryRoomNumber, DateTime dateTime, PrologResponse response)
        {
            try
            {
                var requestCodes = new List<RequestCode>();
                var appointmentNumbers = new List<AppointmentNumber>();

                var surgeryRoom = SurgeryRoomNumberUtils.ToString(surgeryRoomNumber);

                var appointments = response.AppointmentsGenerated.Split(", ");

                foreach (var appointment in appointments)
                {
                    // var modifiedAppointment = appointment.Substring(1, appointment.Length - 2);
                    var appointmentData = appointment.Split(",");

                    var startInMinutes = appointmentData[0];
                    var endInMinutes = appointmentData[1];
                    var code = appointmentData[2];

                    var opRequestCode = new RequestCode();
                    var appointmentNumber = new AppointmentNumber();
                    if (code.ToLower().StartsWith("ap")) continue;
                    else if (code.ToLower().StartsWith("req")) {
                        opRequestCode = new RequestCode(code);
                        var number = code.Substring(3);
                        appointmentNumber = new AppointmentNumber("ap" + number);

                        requestCodes.Add(opRequestCode);
                        appointmentNumbers.Add(appointmentNumber);
                    } else {
                        throw new Exception("Invalid code: " + code);
                    }

                    int hours = int.Parse(startInMinutes) / 60;
                    int minutes = int.Parse(startInMinutes) % 60;
                    var startInHours = hours.ToString("D2") + ":" + minutes.ToString("D2");

                    hours = int.Parse(endInMinutes) / 60;
                    minutes = int.Parse(endInMinutes) % 60;
                    var endInHours = hours.ToString("D2") + ":" + minutes.ToString("D2");

                    var startTime = DateTime.ParseExact(startInHours, "HH:mm", null);
                    var endTime = DateTime.ParseExact(endInHours, "HH:mm", null);

                    var start = dateTime.Date.Add(startTime.TimeOfDay);
                    var end = dateTime.Date.Add(endTime.TimeOfDay);

                    var slot = new Slot(start, end);
                    
                    var creatingAppointment = new CreatingAppointmentDto(opRequestCode, surgeryRoomNumber, appointmentNumber, slot);

                    var addedAppointment = await AddAsync(creatingAppointment);
                }

                return (requestCodes, appointmentNumbers);
            }
            catch (Exception e)
            {
                throw new Exception("Error creating appointments automatically: " + e.Message);
            }
        }

        public async Task<bool> AssignStaff(Dictionary<LicenseNumber, List<AppointmentNumber>> staffAgenda)
        {
            try
            {
                foreach (var staff in staffAgenda)
                {
                    foreach (var appointmentNumber in staff.Value)
                    {
                        var appointment = await _appointmentRepository.GetByNumberAsync(appointmentNumber);
                        if (appointment == null) return false;

                        appointment.AssignStaff(staff.Key);
                    }
                }

                await _unitOfWork.CommitAsync();

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<AppointmentDto> GetByAppointmentNumberAsync(AppointmentNumber appointmentNumber)
        {
            try
            {
                if (appointmentNumber == null)
                    throw new ArgumentNullException(nameof(appointmentNumber));

                var appointment = await _appointmentRepository.GetByNumberAsync(appointmentNumber);

                if (appointment == null)
                    return null;

                return AppointmentMapper.ToDto(appointment);
            }
            catch (Exception)
            {
                return null;
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
            