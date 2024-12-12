using Domain.Shared;

namespace DDDNetCore.src.Domain.RoomTypes
{
    public class RoomTypeCode : IValueObject
    {
        public string Value { get; }

        public RoomTypeCode(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Operation type code cannot be empty");

            if (!value.ToLower().StartsWith("roty"))
                throw new ArgumentException("Operation type code must start with 'roty'");

            Value = value;
        }

        public static implicit operator string(RoomTypeCode requestCode)
        {
            return requestCode.Value;
        }

        public static implicit operator RoomTypeCode(string value)
        {
            return new RoomTypeCode(value);
        }

        public override string ToString()
        {
            return Value;
        }

        public override bool Equals(object? obj)
        {
            if (obj is RoomTypeCode other)
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