using Domain.Shared;

namespace DDDNetCore.Domain.Surgeries;

public class SurgeryMapper
{
    //ToCreating
    public static CreatingSurgery ToCreating(
        string name, string roomType, 
        string roomCapacity, string assignedEquipment)
    {

        return new CreatingSurgery(
            new Name(name),
            RoomTypeUtils.FromString(roomType),
            new RoomCapacity(roomCapacity),
            new AssignedEquipment(assignedEquipment)
            );
    }
    
    //ToEntity
    public static Surgery ToEntity(CreatingSurgery creating, int value)
    {
        return new Surgery(
            creating.Name,
            new SurgeryNumber("so" + value),
            creating.RoomType,
            creating.RoomCapacity,
            creating.AssignedEquipment
        );
    }
}