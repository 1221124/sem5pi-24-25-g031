using System;

namespace Domain.Shared
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

            Value = int.Parse(value);
        }
        //fromString
        public static PhoneNumber FromString(string value)
        {
            return new PhoneNumber(value);
        }
    }
}