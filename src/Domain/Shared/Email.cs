using System;

namespace Domain.Shared
{
    public class Email: IValueObject
    {
        public string Value { get; set;}

        public Email(string value)
        {
            ValidateEmail(value);
            Value = value;
        }

        public static void ValidateEmail(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Email cannot be empty");
            }

            string regex = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
            if (!System.Text.RegularExpressions.Regex.IsMatch(value, regex))
            {
                throw new ArgumentException("Invalid email address");
            }
        }

        public static implicit operator Email(string value)
        {
            ValidateEmail(value);
            return new Email(value);
        }

        public static implicit operator string(Email email)
        {
            ValidateEmail(email.Value);
            return email.Value;
        }

        public override string ToString()
        {
            return Value;
        }

        public override bool Equals(object? obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }

            Email email = (Email)obj;
            return Value == email.Value;
        }

        public override int GetHashCode()
        {
            return Value.GetHashCode();
        }
    }
}