using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.DbLogs;
using Domain.Shared;

namespace DDDNetCore.Domain.Surgeries{
    public class SurgeryRoomService {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISurgeryRoomRepository _repo;
        private readonly IAppointmentRepository _appointmentRepository;
        public SurgeryRoomService(IUnitOfWork unitOfWork, ISurgeryRoomRepository surgeryRoomRepository, IAppointmentRepository appointmentRepository) {
            _unitOfWork = unitOfWork;
            _repo = surgeryRoomRepository;
            _appointmentRepository = appointmentRepository;
        }

        //AddAsync
        public async Task<SurgeryRoom> AddAsync(CreatingSurgeryRoom creating){
            if(creating == null)
                throw new ArgumentNullException(nameof(creating));
            
            var surgery = SurgeryRoomMapper.ToEntity(creating);
            
            await Console.Error.WriteLineAsync("Surgery: " + surgery);
            
                await _repo.AddAsync(surgery);
            await _unitOfWork.CommitAsync();

            //await _logService.AddAsync(new DbLog("Surgery", "Add", surgery.Id.AsString()));

            return surgery;
        }

        //GetAll
        public async Task<List<SurgeryRoomDto>> GetAll() {
            try{
                var surgeryRooms = await _repo.GetAllAsync();
                if(surgeryRooms == null || surgeryRooms.Count == 0)
                    return [];

                return surgeryRooms.Select(SurgeryRoomMapper.ToDto).ToList();
            }
            catch(Exception) {
                return [];
            }
        }

        //GetBySurgeryNumber
        public async Task<SurgeryRoom> GetBySurgeryRoomNumberAsync(SurgeryRoomNumber surgeryRoomNumber)
        {
            try{
                if(surgeryRoomNumber == null)
                    return null;

                //return await _repo.GetBySurgeryNumberAsync(surgeryRoomNumber);
                return await _repo.GetBySurgeryRoomNumberAsync(surgeryRoomNumber);
            }
            catch(Exception){
                return null;
            }   
        }

        public async Task UpdateRoomStatusesAsync()
        {
            Console.WriteLine("Updating room statuses...");
            var surgeryRooms = await _repo.GetAllAsync();

            foreach (var room in surgeryRooms)
            {
                var currentTime = DateTime.Now;
                var appointments = _appointmentRepository.GetByRoomAndDateAsync(room.SurgeryRoomNumber, currentTime.Date).Result;
                if (appointments == null || !appointments.Any())
                {
                    if (room.CurrentStatus == CurrentStatus.OCCUPIED)
                    {
                        room.UpdateStatus(CurrentStatus.AVAILABLE);
                        await _unitOfWork.CommitAsync();
                    }
                }
                else
                {
                    if (room.CurrentStatus == CurrentStatus.AVAILABLE)
                    {
                        if (appointments.Any(a => a.AppointmentDate.Start.Hour <= currentTime.Hour && a.AppointmentDate.End.Hour >= currentTime.Hour &&
                                                   a.AppointmentDate.Start.Minute <= currentTime.Minute && a.AppointmentDate.End.Minute >= currentTime.Minute))
                        {
                            room.UpdateStatus(CurrentStatus.OCCUPIED);
                            await _unitOfWork.CommitAsync();
                        }
                    }
                }
            }
        }

        public async Task<List<SurgeryRoomDto>> GetAvailableAsync(string start, string end, List<AppointmentDto> appointments)
        {
            try {
                var surgeryRooms = await _repo.GetAllAsync();
                var availableRooms = new List<SurgeryRoomDto>();

                if (appointments == null || appointments.Count == 0)
                {
                    return surgeryRooms.Select(SurgeryRoomMapper.ToDto).ToList();
                }

                if (surgeryRooms == null || surgeryRooms.Count == 0)
                    return [];

                if (string.IsNullOrEmpty(start) || string.IsNullOrEmpty(end))
                    return null;

                if (start.Contains('T'))
                    start = start.Replace("T", " ");

                if (end.Contains('T'))
                    end = end.Replace("T", " ");

                var slot = new Slot(start, end);

                foreach (var room in surgeryRooms)
                {
                    var isAvailable = true;
                    foreach (var appointment in appointments)
                    {
                        if (appointment.SurgeryRoomNumber == room.SurgeryRoomNumber)
                        {
                            if (Slot.Overlaps(appointment.AppointmentDate, slot))
                            {
                                isAvailable = false;
                                break;
                            }
                        }
                    }

                    if (isAvailable)
                    {
                        availableRooms.Add(SurgeryRoomMapper.ToDto(room));
                    }
                }

                return availableRooms;
            }
            catch (Exception)
            {
                return [];
            }
        }
    }
}