using Domain.Shared;

namespace Domain.OperationTypes
{
    public class Quantity : IValueObject
    {
        public int Value { get; }

        public Quantity(int value)
        {
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

        public static implicit operator int(Quantity quantity)
        {
            return quantity.Value;
        }
    }
}