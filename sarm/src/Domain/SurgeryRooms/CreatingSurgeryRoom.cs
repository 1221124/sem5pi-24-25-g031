using DDDNetCore.Domain.SurgeryRooms;
using DDDNetCore.src.Domain.RoomTypes;
using Domain.Shared;

namespace DDDNetCore.Domain.Surgeries;

public class CreatingSurgeryRoom
{
    public SurgeryRoomNumber SurgeryRoomNumber { get; private set; }
    public RoomTypeCode RoomType { get; private set; }
    public RoomCapacity RoomCapacity { get; private set; }
    public AssignedEquipment AssignedEquipment { get; private set; }
    
    public CreatingSurgeryRoom(SurgeryRoomNumber surgeryRoomNumber, RoomTypeCode roomType, RoomCapacity roomCapacity, AssignedEquipment assignedEquipment)
    {
        SurgeryRoomNumber = surgeryRoomNumber;
        RoomType = roomType;
        RoomCapacity = roomCapacity;
        AssignedEquipment = assignedEquipment;
    }
}