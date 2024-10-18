namespace Domain.Shared
{
    public class Name : IValueObject
    {
        public string Value { get; }

        public Name(string value)
        {
            Value = value;
        }

        public static implicit operator Name(string value)
        {
            return new Name(value);
        }

        public static implicit operator string(Name name)
        {
            return name.Value;
        }
    }
}