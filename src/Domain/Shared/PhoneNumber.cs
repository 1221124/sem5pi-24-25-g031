using Domain.Shared;

namespace DDDNetCore.src.Domain.Shared
{
    public class PhoneNumber: IValueObject
    {
        public int Value { get; set;}

        public PhoneNumber(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Phone number cannot be empty");
            }

            Value = value;
        }
    }
}