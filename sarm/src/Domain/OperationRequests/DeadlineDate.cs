
using Date = System.DateOnly;

namespace DDDNetCore.Domain.OperationRequests
{
    public class DeadlineDate
    {
        public Date Date;
        
        public DeadlineDate(Date date)
        {
            
            // if (date < DateOnly.FromDateTime(DateTime.Now))
            // {
            //     throw new ArgumentException("Date of birth cannot be in the past.");
            // }
            
            Date = date;
        }

        public DeadlineDate(string date)
        {
            if (!DateOnly.TryParse(date, out Date deadline))
            {
                throw new FormatException("Invalid date format. Use yyyy-MM-dd.");
            }
            Date = deadline;
        }

        public DeadlineDate(DateTime date)
        {
        }

        public static implicit operator DeadlineDate(string date) {
            return new DeadlineDate(date);
        }

        public static implicit operator string(DeadlineDate date) {
            return date.ToString();
        }

        public override string ToString()
        {
            return Date.ToString("yyyy-MM-dd");
        }

        public static Date Parse(string dateString)
        {
            if (!DateOnly.TryParseExact(dateString, "yyyy-MM-dd", out Date date))
            {
                throw new FormatException("Invalid date format. Use yyyy-MM-dd.");
            }
            return date;
        }

        public static bool Equals(DeadlineDate date1, DeadlineDate date2)
        {
            return date1.Date.Equals(date2.Date);
        }

        public int CompareTo(DeadlineDate deadlineDate)
        {
            return Date.Year.CompareTo(deadlineDate.Date.Year) == 0
                ? Date.Month.CompareTo(deadlineDate.Date.Month) == 0
                    ? Date.Day.CompareTo(deadlineDate.Date.Day)
                    : Date.Month.CompareTo(deadlineDate.Date.Month)
                : Date.Year.CompareTo(deadlineDate.Date.Year);
        }
    }
}
