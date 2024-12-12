namespace Domain.Shared
{
    public class Description : IValueObject
    {
        public string Value { get; set; }

        public Description(string value)
        {
            Value = value;
        }

        public static implicit operator Description(string value)
        {
            return new Description(value);
        }

        public static implicit operator string(Description name)
        {
            return name.Value;
        }

        public override bool Equals(object? obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }

            return Value == ((Description)obj).Value;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Value);
        }
    }
}