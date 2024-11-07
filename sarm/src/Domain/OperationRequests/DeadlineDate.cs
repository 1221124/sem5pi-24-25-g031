
using Date = System.DateOnly;

namespace Domain.OperationRequests
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

        public DeadlineDate() {
        }

        public DeadlineDate(string date)
        {
            if (!DateOnly.TryParse(date, out Date deadline))
            {
                throw new FormatException("Invalid date format. Use yyyy-MM-dd.");
            }
            Date = deadline;
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
    }
}
