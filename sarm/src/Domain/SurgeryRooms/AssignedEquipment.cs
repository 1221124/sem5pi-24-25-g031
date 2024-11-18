namespace DDDNetCore.Domain.SurgeryRooms
{
    public class AssignedEquipment
    {
        public string Equipment { get; private set; }
        public AssignedEquipment(string equipment)
        {
            Equipment = equipment;
        }
        
        public override string ToString()
        {
            return Equipment;
        }
    }
}