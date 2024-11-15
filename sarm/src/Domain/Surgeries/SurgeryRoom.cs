using Domain.Shared;

namespace DDDNetCore.Domain.Surgeries
{
    public class SurgeryRoom : IValueObject
    {
        public string Name { get; private set; }

        public SurgeryRoom(Name name)
        {
            Name = name;
        }
    }
}