using DDDNetCore.Domain.Surgeries;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.Shared;

namespace DDDNetCore.Domain.SurgeryRooms;

public class SurgeryRoomMapper
{
    //ToCreating
    public static CreatingSurgeryRoom ToCreating(
        string surgeryRoomNumber, string roomType, string roomCapacity, string assignedEquipment
    )
    {
        return new CreatingSurgeryRoom(
            SurgeryRoomNumberUtils.FromString(surgeryRoomNumber),
            RoomTypeUtils.FromString(roomType),
            new RoomCapacity(roomCapacity),
            new AssignedEquipment(assignedEquipment)
        );
    }
    //ToEntity
    public static SurgeryRoom ToEntity(CreatingSurgeryRoom creating)
    {
        return new SurgeryRoom(
            creating.SurgeryRoomNumber,
            creating.RoomType,
            creating.RoomCapacity,
            creating.AssignedEquipment
        );
    }
}