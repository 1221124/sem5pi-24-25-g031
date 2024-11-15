using Domain.Shared;

namespace DDDNetCore.Domain.Surgeries;

public class Surgery: Entity<SurgeryId>, IAggregateRoot
{
    public Name Name { get; private set; }
    public SurgeryNumber SurgeryNumber { get; private set; }
    public RoomType RoomType { get; private set; }
    public RoomCapacity RoomCapacity { get; private set; }
    public AssignedEquipment AssignedEquipment { get; private set; }
    public CurrentStatus CurrentStatus { get; private set; }
    public List<Slot> MaintenanceSlots { get; private set; }    

    public Surgery()
    {
    }
    public Surgery(Name name, SurgeryNumber surgeryNumber, RoomType roomType, RoomCapacity roomCapacity, AssignedEquipment assignedEquipment, CurrentStatus currentStatus, List<Slot> maintenanceSlots)
    {
        Name = name;
        SurgeryNumber = surgeryNumber;
        RoomType = roomType;
        RoomCapacity = roomCapacity;
        AssignedEquipment = assignedEquipment;
        CurrentStatus = currentStatus;
        MaintenanceSlots = maintenanceSlots;
    }
}