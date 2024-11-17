using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.Surgeries;
using Domain.DbLogs;
using Domain.OperationRequests;
using Domain.Shared;

namespace DDDNetCore.Domain.Appointments
{
    public class AppointmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly SurgeryService _surgeryService;
        private readonly OperationRequestService _operationRequestService;


        public AppointmentService(IUnitOfWork unitOfWork, SurgeryService surgeryService,
            IAppointmentRepository appointmentRepository, OperationRequestService operationRequestService)
        {
            _unitOfWork = unitOfWork;
            _appointmentRepository = appointmentRepository;
            _surgeryService = surgeryService;
            _operationRequestService = operationRequestService;
        }

        public async Task<Dictionary<Appointment, Surgery>> Planning(AppointmentDate date)
        {
            Dictionary<Appointment, Surgery> bc = []; //bc - Base de Conhecimento 

            var appointments = await _appointmentRepository.GetAllAsync();

            foreach (var appointment in appointments)
            {
                if (appointment.AppointmentDate.Date == date.Date)
                {
                    var surgery = await _surgeryService.GetBySurgeryNumberAsync(appointment.SurgeryNumber);

                    if (surgery == null) return [];

                    bc.Add(appointment, surgery);
                }
            }

            if (bc.Count == 0)
            {
                return [];
            }

            return bc.OrderBy(x => x.Key.Priority).ToDictionary(x => x.Key, x => x.Value);
        }

        public async Task<IEnumerable<Appointment>> GetAll()
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

                    var newAppointment = AppointmentMapper.ToEntity(appointment, op[0]);

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
            