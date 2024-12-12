
using Domain.Shared;

namespace DDDNetCore.src.Domain.RoomTypes
{
    public interface IRoomTypeRepository: IRepository<RoomType, RoomTypeId>
    {
        Task<RoomType> GetByCodeAsync(RoomTypeCode roomTypeCode);
        Task<string?> GetLastCodeAsync();
    }
}