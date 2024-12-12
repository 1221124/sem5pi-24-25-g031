using Domain.Shared;

namespace DDDNetCore.src.Domain.RoomTypes
{
    public class RoomTypeService {
        private readonly IRoomTypeRepository _repo;
        private readonly IUnitOfWork _unitOfWork;

        public RoomTypeService(IRoomTypeRepository roomTypeRepository, IUnitOfWork unitOfWork) {
            _repo = roomTypeRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<RoomTypeDto> AddAsync(CreatingRoomTypeDto creating, RoomTypeCode roomTypeCode) {
            try {
                if(creating == null)
                    return null;
                
                var roomType = new RoomType(roomTypeCode, creating.Name, creating.Description, creating.AvailableForSurgeries);
                
                await _repo.AddAsync(roomType);
                await _unitOfWork.CommitAsync();

                return RoomTypeMapper.ToDto(roomType);
            }
            catch(Exception) {
                return null;
            }
        }

        public async Task<List<RoomType>> GetAll() {
            try{
                return await _repo.GetAllAsync();
            }
            catch(Exception) {
                return null;
            }
        }

        public async Task<RoomTypeCode> AssignCodeAsync()
        {
            try{
                var lastCode = await _repo.GetLastCodeAsync();

                int lastNumber = 0;
                if (!string.IsNullOrEmpty(lastCode) && lastCode.Trim().ToLower().StartsWith("roty"))
                {
                    if (int.TryParse(lastCode[3..], out var parsedNumber))
                    {
                        lastNumber = parsedNumber;
                    }
                }

                int nextNumber = lastNumber + 1;
                return new RoomTypeCode($"roty{nextNumber}");
            }catch (Exception)
            {
                return new RoomTypeCode("roty1");
            }
        }
    }
}