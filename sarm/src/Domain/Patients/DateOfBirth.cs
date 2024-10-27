
using Date = System.DateOnly;

namespace Domain.Patients
{
    public class DateOfBirth
    {
        public Date BirthDate;
        
        public DateOfBirth(Date dateOfBirth)
        {
            
            if (dateOfBirth > DateOnly.FromDateTime(DateTime.Now))
            {
                throw new ArgumentException("Date of birth cannot be in the future.");
            }
            
            this.BirthDate = dateOfBirth;
        }

        public DateOfBirth() {
        }

        public DateOfBirth(string dateOfBirth)
        {
            if (!DateOnly.TryParse(dateOfBirth, out Date date))
            {
                throw new FormatException("Invalid date format. Use yyyy-MM-dd.");
            }
            this.BirthDate = date;
        }
        
        public override string ToString()
        {
            return BirthDate.ToString("yyyy-MM-dd");
        }

        // Parse method to create DateOfBirth from a string
        public static DateOfBirth Parse(string dateString)
        {
            if (!DateOnly.TryParseExact(dateString, "yyyy-MM-dd", out Date dateOfBirth))
            {
                throw new FormatException("Invalid date format. Use yyyy-MM-dd.");
            }
            return new DateOfBirth(dateOfBirth);
        }
        public override bool Equals(object? obj)
        {
            // Check if the object is a DateOfBirth instance
            if (obj is DateOfBirth other)
            {
                // Compare the BirthDate property
                return BirthDate == other.BirthDate;
            }
            return false;
        }

        public override int GetHashCode()
        {
            // Use the hash code of the BirthDate
            return BirthDate.GetHashCode();
        }
        
    }
}
