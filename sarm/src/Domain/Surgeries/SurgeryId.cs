using Domain.Shared;

namespace DDDNetCore.Domain.Surgeries
{
    public class SurgeryId : EntityId
    {
        public SurgeryId(Guid value) : base(value)
        {
        }
        
        public SurgeryId(string value) : base(Guid.Parse(value))
        {
        }

        public override object createFromString(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                throw new ArgumentException("The string cannot be null or empty.", nameof(text));

            if (Guid.TryParse(text, out Guid guid))
            {
                return new SurgeryId(guid);
            }

            throw new ArgumentException("Invalid surgery ID format.", nameof(text));
        }

        public override string AsString()
        {
            return Value.ToString();
        }
    }
}