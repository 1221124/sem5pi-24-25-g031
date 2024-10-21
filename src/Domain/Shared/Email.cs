using System;

namespace Domain.Shared
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

        public static implicit operator Email(string value)
        {
            return new Email(value);
        }

        public static implicit operator string(Email email)
        {
            return email.Value;
        }
    }
}