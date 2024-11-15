using DDDNetCore.Domain.Appointments;
using Domain.DbLogs;
using Domain.Shared;

namespace DDDNetCore.Domain.Surgeries{
    public class SurgeryService{
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISurgeryRepository _repo;
        private readonly DbLogService _logService;
        public SurgeryService(IUnitOfWork unitOfWork, ISurgeryRepository surgeryRepository, DbLogService logService){
            _unitOfWork = unitOfWork;
            _repo = surgeryRepository;
            _logService = logService;
        }

        //AddAsync
        public async Task<Surgery> AddAsync(Surgery surgery){
            if(surgery == null)
                throw new ArgumentNullException(nameof(surgery));

            await _repo.AddAsync(surgery);
            await _unitOfWork.CommitAsync();

            //await _logService.AddAsync(new DbLog("Surgery", "Add", surgery.Id.AsString()));

            return surgery;
        }

        //GetAll
        public async Task<List<Surgery>> GetAll(){
            try{
                return await _repo.GetAllAsync();
            }
            catch(Exception){
                return new List<Surgery>();
            }
        }

        //GetBySurgeryNumber
        public async Task<Surgery?> GetBySurgeryNumberAsync(SurgeryNumber surgeryNumber)
        {
            try{
            if(surgeryNumber == null)
                return null;

            return await _repo.GetBySurgeryNumberAsync(surgeryNumber);
            }
            catch(Exception){
                return null;
            }   
        }
    }
}