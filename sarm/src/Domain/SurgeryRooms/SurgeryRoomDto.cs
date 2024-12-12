using DDDNetCore.Domain.Surgeries;
using DDDNetCore.src.Domain.RoomTypes;
using Domain.Shared;

namespace DDDNetCore.Domain.SurgeryRooms;

public class SurgeryRoomDto
{
    public Guid Id { get; private set; }
    public SurgeryRoomNumber SurgeryRoomNumber { get; private set; } 
    public RoomTypeCode RoomTypeCode { get; private set; }
    public RoomCapacity RoomCapacity { get; private set; }
    public AssignedEquipment AssignedEquipment { get; private set; }
    public CurrentStatus CurrentStatus { get; private set; }
    public List<Slot> MaintenanceSlots { get; private set; }    
    
    public SurgeryRoomDto(Guid id, SurgeryRoomNumber surgeryRoomNumber, RoomTypeCode roomTypeCode, RoomCapacity roomCapacity, AssignedEquipment assignedEquipment, CurrentStatus currentStatus, List<Slot> maintenanceSlots)
    {
        Id = id;
        SurgeryRoomNumber = surgeryRoomNumber;
        RoomTypeCode = roomTypeCode;
        RoomCapacity = roomCapacity;
        AssignedEquipment = assignedEquipment;
        CurrentStatus = currentStatus;
        MaintenanceSlots = maintenanceSlots;
    }
}