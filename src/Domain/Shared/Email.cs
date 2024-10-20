using Domain.Shared;

namespace DDDNetCore.src.Domain.Shared
{
    public class Email: IValueObject
    {
        public string Value { get; set;}

        public Email(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Email cannot be empty");
            }

            Value = value;
        }
    }
}