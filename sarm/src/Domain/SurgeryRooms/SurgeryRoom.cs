using DDDNetCore.Domain.Surgeries;
using Domain.Shared;
using Domain.SurgeryRooms;

namespace DDDNetCore.Domain.SurgeryRooms;

public class SurgeryRoom: Entity<SurgeryRoomId>, IAggregateRoot
{
    public SurgeryRoomNumber SurgeryRoomNumber { get; private set; } //room number - 
    public RoomType RoomType { get; private set; }
    public RoomCapacity RoomCapacity { get; private set; }
    public AssignedEquipment AssignedEquipment { get; private set; }
    public CurrentStatus CurrentStatus { get; private set; }
    public List<Slot> MaintenanceSlots { get; private set; }    
    
    public SurgeryRoom(SurgeryRoomNumber surgeryRoomNumber, RoomType roomType, RoomCapacity roomCapacity, AssignedEquipment assignedEquipment)
    {
        Id = new SurgeryRoomId(Guid.NewGuid());
        SurgeryRoomNumber = surgeryRoomNumber;
        RoomType = roomType;
        RoomCapacity = roomCapacity;
        AssignedEquipment = assignedEquipment;
        CurrentStatus = CurrentStatus.AVAILABLE;
        MaintenanceSlots = new List<Slot>();
    }

    public void UpdateStatus(CurrentStatus status)
    {
        CurrentStatus = status;
    }
}