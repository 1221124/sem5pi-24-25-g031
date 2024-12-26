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

    public static bool SameValue(AppointmentNumber ap1, AppointmentNumber ap2)
    {
        return string.Equals(ap1.Value.Trim().ToLower(), ap2.Value.Trim().ToLower());
    }

    public override bool Equals(object obj)
    {
        return obj is AppointmentNumber other && Value.Trim().ToLower() == other.Value.Trim().ToLower();
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