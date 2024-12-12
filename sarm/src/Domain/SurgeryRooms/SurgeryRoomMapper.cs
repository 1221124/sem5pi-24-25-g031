using DDDNetCore.Domain.Surgeries;
using DDDNetCore.Domain.SurgeryRooms;
using DDDNetCore.src.Domain.RoomTypes;
using Domain.Shared;

namespace DDDNetCore.Domain.SurgeryRooms;

public class SurgeryRoomMapper
{
    public static CreatingSurgeryRoom ToCreating(
        string surgeryRoomNumber, string roomTypeCode, string roomCapacity, string assignedEquipment
    )
    {
        return new CreatingSurgeryRoom(
            SurgeryRoomNumberUtils.FromString(surgeryRoomNumber),
            new RoomTypeCode(roomTypeCode),
            new RoomCapacity(roomCapacity),
            new AssignedEquipment(assignedEquipment)
        );
    }

    public static SurgeryRoom ToEntity(CreatingSurgeryRoom creating)
    {
        return new SurgeryRoom(
            creating.SurgeryRoomNumber,
            creating.RoomType,
            creating.RoomCapacity,
            creating.AssignedEquipment
        );
    }

    public static SurgeryRoomDto ToDto(SurgeryRoom entity)
    {
        return new SurgeryRoomDto(
            entity.Id.AsGuid(),
            entity.SurgeryRoomNumber,
            entity.RoomType,
            entity.RoomCapacity,
            entity.AssignedEquipment,
            entity.CurrentStatus,
            entity.MaintenanceSlots
        );
    }
}