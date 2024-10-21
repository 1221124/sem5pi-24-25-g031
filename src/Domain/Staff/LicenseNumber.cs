using Domain.Shared;

namespace Domain.Staff
{
    public class LicenseNumber : IValueObject
    {
        public string Value { get; private set; }

        public LicenseNumber(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("License number cannot be empty");

            if (value.Length > 10)
                throw new BusinessRuleValidationException("License number cannot be longer than 10 characters");

            Value = value;
        }

        public static implicit operator LicenseNumber(string value)
        {
            return new LicenseNumber(value);
        }

        public static implicit operator string(LicenseNumber licenseNumber)
        {
            return licenseNumber.Value;
        }
    }
}