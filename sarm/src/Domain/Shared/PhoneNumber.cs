using System;
using Newtonsoft.Json;

namespace Domain.Shared
{
    public class PhoneNumber : IValueObject
    {
        public long Value { get; set; }
        [JsonConstructor]
        public PhoneNumber(long value)
        {
            // if (value <= 0)
            // {
            //     throw new ArgumentException("Phone number must be a positive number.");
            // }
            Value = value;
        }

        public PhoneNumber(string value)
        {
            if (string.IsNullOrWhiteSpace(value) || !long.TryParse(value, out long result) || result <= 0)
            {
                throw new ArgumentException("Invalid phone number.");
            }
            Value = result;
        }

        public PhoneNumber() { }

        public static PhoneNumber FromString(string value)
        {
            return new PhoneNumber(long.Parse(value));
        }

        public static implicit operator string(PhoneNumber phoneNumber)
        {
            return phoneNumber.Value.ToString();
        }

        public override string ToString()
        {
            return Value.ToString();
        }
        public override bool Equals(object obj)
        {
            return obj is PhoneNumber number && Value == number.Value;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Value);
        }

        public static bool operator ==(PhoneNumber? left, PhoneNumber right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(PhoneNumber? left, PhoneNumber right)
        {
            return !Equals(left, right);
        }
    }

}