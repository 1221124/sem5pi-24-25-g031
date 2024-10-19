using System;

namespace Domain.Log{
    public class LogId{
        public Guid Value { get; }

        public LogId(Guid value)
        {
            if (value == default)
            {
                throw new ArgumentNullException(nameof(value), "Log id cannot be empty");
            }

            Value = value;
        }

        public static implicit operator Guid(LogId self) => self.Value;
        public static implicit operator LogId(Guid value) => new LogId(value);
        public override string ToString() => Value.ToString();
    }
}