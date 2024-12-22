using Domain.Shared;

namespace DDDNetCore.Domain.Specializations;

public class SNOMEDCTCode : IValueObject
{
    public string Value { get; }

    public SNOMEDCTCode(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Specialization code cannot be empty");

        if (!value.ToLower().StartsWith("CT"))
            throw new ArgumentException("Specialization code must start with 'CT'");

        Value = value;
    }

    public static implicit operator string(SNOMEDCTCode requestCode)
    {
        return requestCode.Value;
    }

    public static implicit operator SNOMEDCTCode(string value)
    {
        return new SNOMEDCTCode(value);
    }

    public override string ToString()
    {
        return Value;
    }

    public override bool Equals(object? obj)
    {
        if (obj is SNOMEDCTCode other)
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