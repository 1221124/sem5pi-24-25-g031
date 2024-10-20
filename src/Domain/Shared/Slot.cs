using System;

namespace Domain.Shared
{
    public class Slot : IValueObject
    {
        public DateTime start { get; private set; }

        public DateTime end { get; private set; }

        public Slot(DateTime start, DateTime end)
        {
            this.start = start;
            this.end = end;
        }

        public static implicit operator Slot(string value)
        {
            var dates = value.Split(' ');
            return new Slot(DateTime.Parse(dates[0]), DateTime.Parse(dates[1]));
        }

        public static implicit operator string(Slot slot)
        {
            return $"{slot.start} {slot.end}";
        }
    }
}