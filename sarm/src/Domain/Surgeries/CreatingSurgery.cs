using Domain.Shared;

namespace DDDNetCore.Domain.Surgeries;

public class CreatingSurgery
{
    public Name Name { get; private set; }
    public RoomType RoomType { get; private set; }
    public RoomCapacity RoomCapacity { get; private set; }
    public AssignedEquipment AssignedEquipment { get; private set; }
    
    public CreatingSurgery(Name name, RoomType roomType, RoomCapacity roomCapacity, AssignedEquipment assignedEquipment)
    {
        Name = name;
        RoomType = roomType;
        RoomCapacity = roomCapacity;
        AssignedEquipment = assignedEquipment;
    }
}