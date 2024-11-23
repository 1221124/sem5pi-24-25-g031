namespace DDDNetCore.Domain.Appointments;

public class AppointmentNumber
{
    public string Value { get; private set; }

    public AppointmentNumber()
    {
    }

    public AppointmentNumber(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Appointment number cannot be empty");
        }

        if (!value.ToLower().StartsWith("ap"))
        {
            throw new ArgumentException("Appointment number must start with 'ap'");
        }

        Value = value;
    }

    public static implicit operator string(AppointmentNumber appointmentNumber)
    {
        return appointmentNumber.Value;
    }

    public static implicit operator AppointmentNumber(string value)
    {
        return new AppointmentNumber(value);
    }

    public override string ToString()
    {
        return Value;
    }

    public override bool Equals(object obj)
    {
        var other = obj as AppointmentNumber;

        if (ReferenceEquals(other, null))
        {
            return false;
        }

        if (ReferenceEquals(this, other))
        {
            return true;
        }

        if (GetType() != obj.GetType())
        {
            return false;
        }

        return Value == other.Value;
    }

    public override int GetHashCode()
    {
        return Value.GetHashCode();
    }

    public static bool operator ==(AppointmentNumber a, AppointmentNumber b)
    {
        if (ReferenceEquals(a, null) && ReferenceEquals(b, null))
        {
            return true;
        }

        if (ReferenceEquals(a, null) || ReferenceEquals(b, null))
        {
            return false;
        }

        return a.Equals(b);
    }

    public static bool operator !=(AppointmentNumber a, AppointmentNumber b)
    {
        return !(a == b);
    }
}