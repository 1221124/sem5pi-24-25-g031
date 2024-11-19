using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.Surgeries;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.DbLogs;
using Domain.OperationRequests;
using Domain.Shared;

namespace DDDNetCore.Domain.Appointments
{
    public class AppointmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly SurgeryRoomService _surgeryRoomService;
        private readonly OperationRequestService _operationRequestService;


        public AppointmentService(IUnitOfWork unitOfWork, SurgeryRoomService surgeryRoomService,
            IAppointmentRepository appointmentRepository, OperationRequestService operationRequestService)
        {
            _unitOfWork = unitOfWork;
            _appointmentRepository = appointmentRepository;
            _surgeryRoomService = surgeryRoomService;
            _operationRequestService = operationRequestService;
        }

        public async Task<List<Appointment>> GetByDateAsync(AppointmentDate date)
        {
            return await _appointmentRepository.GetByDateAsync(date);
        }

        public async Task<List<Appointment>> GetAll()
        {
            return await _appointmentRepository.GetAllAsync();
        }

        public async Task<Appointment?> AddAsync(CreatingAppointment appointment)
        {
            try
            {
                if (appointment == null)
                    throw new ArgumentNullException(nameof(appointment));


                var operationRequest = await _operationRequestService.GetFilteredAsync(
                    null, null, null, null, null, null,
                    RequestStatus.ACCEPTED.ToString());

                if (operationRequest.Any(x => x.Id.ToString() == appointment.OperationRequestId.Value))
                {
                    var op = await _operationRequestService.GetFilteredAsync(
                        appointment.OperationRequestId.Value,
                        null, null, null, null, null, null
                    );

                    if (op == null || op.Count != 1) return null;
                    
                    var all = await _appointmentRepository.GetAllAsync();

                    var newAppointment = AppointmentMapper.ToEntity(appointment, all.Count + 1);

                    await _appointmentRepository.AddAsync(newAppointment);
                    await _unitOfWork.CommitAsync();

                    //await _logService.AddAsync(new DbLog("Appointment", "Add", appointment.Id.AsString()));   
                    return newAppointment;
                }
            }
            catch (Exception)
            {
                return null;
            }
            
            return null;
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
            