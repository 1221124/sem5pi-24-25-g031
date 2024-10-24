using System;

namespace Domain.Shared
{
    public class PhoneNumber : IValueObject
    {
        public int Value { get; set; }

        public PhoneNumber(int value) 
        {
            if (value <= 0) 
            {
                throw new ArgumentException("Phone number must be a positive integer.");
            }
            Value = value;
        }
        public PhoneNumber(string value)
        {
            if (string.IsNullOrWhiteSpace(value) || !int.TryParse(value, out int result) || result <= 0)
            {
                throw new ArgumentException("Invalid phone number.");
            }
            Value = result;
        }
        public PhoneNumber()
        {
        }
        
        public static PhoneNumber FromString(string value)
        {
            return new PhoneNumber(int.Parse(value));
        }
        
        public static implicit operator string(PhoneNumber phoneNumber)
        {
            return phoneNumber.Value.ToString();
        }

        public override string ToString()
        {
            return Value.ToString();
        }
    }

}