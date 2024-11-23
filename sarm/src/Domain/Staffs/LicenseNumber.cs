using Domain.Shared;

namespace Domain.Staffs
{
    public class LicenseNumber : IValueObject
    {
        public string Value { get; private set; }

        public LicenseNumber(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new BusinessRuleValidationException("License number cannot be empty");

            if (value.Length > 100)
                throw new BusinessRuleValidationException("License number cannot be longer than 10 characters");

            Value = value;
        }

        public LicenseNumber(){}

        public static implicit operator LicenseNumber(string value)
        {
            return new LicenseNumber(value);
        }

        public static implicit operator string(LicenseNumber licenseNumber)
        {
            return licenseNumber.Value;
        }
        
        public override string ToString()
        {
            return Value;
        }

        public override bool Equals(object obj)
        {
            if (obj is LicenseNumber other)
            {
                return Value.Trim().ToLower().Equals(other.Value.Trim().ToLower());
            }
            return false;
        }
        
        public bool Equals(LicenseNumber a, LicenseNumber b)
        {
            return a.Value.Trim().ToLower().Equals(b.Value.Trim().ToLower());
        }

    }
}