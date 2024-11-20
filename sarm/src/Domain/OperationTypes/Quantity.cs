using Domain.Shared;

namespace Domain.OperationTypes
{
    public class Quantity : IValueObject
    {
        public int Value { get; }

        public Quantity(int value)
        {
            if (value < 0)
            {
                throw new BusinessRuleValidationException("Quantity cannot be negative.");
            }
            Value = value;
        }

        public static implicit operator Quantity(int value)
        {
            if (value < 0)
            {
                throw new BusinessRuleValidationException("Quantity cannot be negative.");
            }
            return new Quantity(value);
        }

        public static implicit operator Quantity(string value)
        {
            if (!int.TryParse(value, out int quantityValue) || quantityValue < 0)
            {
                throw new BusinessRuleValidationException("Invalid Quantity value.");
            }
            return new Quantity(quantityValue);
        }

        public static implicit operator string(Quantity quantity)
        {
            return quantity.Value.ToString();
        }

        public static implicit operator int(Quantity quantity)
        {
            return quantity.Value;
        }

        public override bool Equals(object? obj)
        {
            return obj is Quantity quantity &&
                   Value == quantity.Value;
        }
    }
}