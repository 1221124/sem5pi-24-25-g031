using System;

namespace Domain.Patient{
    public class PatientId{
        public Guid Value { get; }

        public PatientId(Guid value)
        {
            if (value == default)
            {
                throw new ArgumentNullException(nameof(value), "Patient id cannot be empty");
            }

            Value = value;
        }

        public static implicit operator Guid(PatientId self) => self.Value;
        public static implicit operator PatientId(Guid value) => new PatientId(value);
        public override string ToString() => Value.ToString();
    }
}