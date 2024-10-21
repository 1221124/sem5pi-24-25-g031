using System;
using Domain.Shared;

namespace Domain.Users
{
    public class Username: IValueObject
    {
        public string Value { get; set;}

        public Username(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Username cannot be empty");
            }

            Value = value;
        }

        public static implicit operator Username(string value)
        {
            return new Username(value);
        }
    }
}