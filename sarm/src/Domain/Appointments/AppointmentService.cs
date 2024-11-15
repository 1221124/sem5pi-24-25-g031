using DDDNetCore.Domain.Surgeries;
using Domain.DbLogs;
using Domain.Shared;

namespace DDDNetCore.Domain.Appointments{
    public class AppointmentService{
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly SurgeryService _surgeryService;
        private readonly DbLogService _logService;

        public AppointmentService(IUnitOfWork unitOfWork, SurgeryService surgeryService, IAppointmentRepository appointmentRepository, DbLogService logService)
        {
            _unitOfWork = unitOfWork;
            _appointmentRepository = appointmentRepository;
            _surgeryService = surgeryService;
            _logService = logService;           
        }

        public async Task<Dictionary<Appointment, Surgery>> Planning(AppointmentDate date)
        {
            Dictionary<Appointment, Surgery> bc = []; //bc - Base de Conhecimento 

            var appointments = await _appointmentRepository.GetAllAsync();

            foreach (var appointment in appointments)
            {
                if (appointment.AppointmentDate.Date == date.Date){
                    var surgery = await _surgeryService.GetBySurgeryNumberAsync(appointment.SurgeryNumber);

                    if (surgery == null)return [];

                    bc.Add(appointment, surgery);
                }
            }

            if(bc.Count == 0){
                return [];
            }

            return bc.OrderBy(x => x.Key.Priority).ToDictionary(x => x.Key, x => x.Value);
        }

        public async Task<Appointment> AddAsync(Appointment appointment)
        {
            if (appointment == null)
                throw new ArgumentNullException(nameof(appointment));            

            await _appointmentRepository.AddAsync(appointment);
            await _unitOfWork.CommitAsync();

            //await _logService.AddAsync(new DbLog("Appointment", "Add", appointment.Id.AsString()));

            return appointment;
        }
    }
}