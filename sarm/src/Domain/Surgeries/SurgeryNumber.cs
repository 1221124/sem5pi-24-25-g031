using Domain.Shared;

namespace DDDNetCore.Domain.Surgeries;

public class SurgeryNumber : IValueObject
{

    public string Value { get; private set; }

    public SurgeryNumber(string value)
    {
        if (value == "")
            throw new BusinessRuleValidationException("Appointment Id cannot be empty");

        Value = value;
    }

    public override string ToString()
    {
        return Value.ToString();
    }
    
    public bool Equals(SurgeryNumber a, SurgeryNumber b)
    {
        return a.ToString().Trim().ToLower().Equals(b.ToString().Trim().ToLower());
    }
}