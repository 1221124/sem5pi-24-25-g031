using System;

namespace Domain.Shared
{
    public class Slot : IValueObject
    {
        public DateTime Start { get; private set; }

        public DateTime End { get; private set; }

        public Slot(DateTime start, DateTime end)
        {
            if (end <= start)
                throw new BusinessRuleValidationException("The end time must be after the start time.");

            Start = start;
            End = end;
        }

        public static implicit operator Slot(string value)
        {
            //"2024-09-25:14h00-18h00" or "2024-09-25:19h00/2024-09-26:02h00"
            var dateAndTime = value.Split(new char[] { ':', '-', '/' }, StringSplitOptions.RemoveEmptyEntries);

            if (dateAndTime.Length != 4)
                throw new BusinessRuleValidationException("Invalid slot format. Correct format is 'YYYY-MM-DD:HHhMM-HHhMM' or 'YYYY-MM-DD:HHhMM/YYYY-MM-DD:HHhMM'.");

            // Parse the start date and time
            DateTime start = DateTime.ParseExact($"{dateAndTime[0]} {dateAndTime[1]}", "yyyy-MM-dd HH'h'mm", null);

            DateTime end;
            if (dateAndTime.Length == 4 && dateAndTime[2].Contains("/"))
            {
                end = DateTime.ParseExact($"{dateAndTime[2]} {dateAndTime[3]}", "yyyy-MM-dd HH'h'mm", null);
            }
            else
            {
                var endTime = DateTime.ParseExact(dateAndTime[2], "HH'h'mm", null);
                end = new DateTime(start.Year, start.Month, start.Day, endTime.Hour, endTime.Minute, 0);
            }

            return new Slot(start, end);
        }

        public static implicit operator string(Slot slot)
        {
            if (slot.Start.Date == slot.End.Date)
            {
                return $"{slot.Start:yyyy-MM-dd}:{slot.Start:HH'h'mm}-{slot.End:HH'h'mm}";
            }
            else
            {
                return $"{slot.Start:yyyy-MM-dd}:{slot.Start:HH'h'mm}/{slot.End:yyyy-MM-dd}:{slot.End:HH'h'mm}";
            }
        }
    }
}