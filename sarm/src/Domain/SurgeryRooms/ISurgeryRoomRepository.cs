using DDDNetCore.Domain.Surgeries;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.Shared;
using Domain.SurgeryRooms;

namespace DDDNetCore.Domain.SurgeryRooms{
    public interface ISurgeryRoomRepository : IRepository<SurgeryRoom, SurgeryRoomId>
    {

    //GetBySurgeryNumberAsync
    public Task<SurgeryRoom> GetBySurgeryRoomNumberAsync(SurgeryRoomNumber surgeryRoomNumber);
    }
}