namespace DDDNetCore.Domain.Surgeries
{
    public class AssignedEquipment
    {
        public List<string> Equipment { get; private set; }
        public AssignedEquipment(List<string> equipment)
        {
            Equipment = equipment;
        }

        public AssignedEquipment(string equipment)
        {
            Equipment = new List<string> { equipment };
        }

        public void AddEquipment(string equipment)
        {
            Equipment.Add(equipment);
        }

        public void RemoveEquipment(string equipment)
        {
            Equipment.Remove(equipment);
        }
    }
}