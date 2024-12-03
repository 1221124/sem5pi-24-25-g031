using Domain.Shared;

namespace Domain.OperationTypes
{
    public class OperationTypeCode : IValueObject
    {
        public string Value { get; }

        public OperationTypeCode(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Operation type code cannot be empty");

            if (!value.ToLower().StartsWith("typ"))
                throw new ArgumentException("Operation type code must start with 'typ'");

            Value = value;
        }

        public static implicit operator string(OperationTypeCode requestCode)
        {
            return requestCode.Value;
        }

        public static implicit operator OperationTypeCode(string value)
        {
            return new OperationTypeCode(value);
        }

        public override string ToString()
        {
            return Value;
        }

        public override bool Equals(object? obj)
        {
            if (obj is OperationTypeCode other)
            {
                return this.Value == other.Value;
            }
            return false;
        }
    
        public override int GetHashCode()
        {
            return Value != null ? Value.GetHashCode() : 0;
        }
    }
}