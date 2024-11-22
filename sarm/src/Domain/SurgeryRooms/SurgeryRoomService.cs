using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.DbLogs;
using Domain.Shared;

namespace DDDNetCore.Domain.Surgeries{
    public class SurgeryRoomService{
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISurgeryRoomRepository _repo;
        private readonly DbLogService _logService;
        public SurgeryRoomService(IUnitOfWork unitOfWork, ISurgeryRoomRepository surgeryRoomRepository, DbLogService logService){
            _unitOfWork = unitOfWork;
            _repo = surgeryRoomRepository;
            _logService = logService;
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
        public async Task<List<SurgeryRoom>> GetAll() {
            try{
                return await _repo.GetAllAsync();
            }
            catch(Exception) {
                return null;
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
    }
}