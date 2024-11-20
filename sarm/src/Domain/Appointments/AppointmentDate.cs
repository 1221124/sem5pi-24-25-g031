using System.Globalization;
using Domain.Shared;

namespace DDDNetCore.Domain.Appointments {
    public class AppointmentDate : IValueObject {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        public AppointmentDate() {
        }

        public AppointmentDate(DateTime date) {
            if(date <= DateTime.Now) {
                throw new ArgumentException("Appointment Date must be after this moment.");
            }

            Start = date;
            End = date;
        }

        public AppointmentDate(string dateStr) {
            if(!DateTime.TryParse(dateStr, out DateTime date)) {
                throw new FormatException("Invalid date format. Use yyyy-MM-dd.");
            }

            if(date <= DateTime.Now) {
                throw new ArgumentException("Appointment Date must be after this moment.");
            }

            Start = date;
            End = date;
        }
 
        public AppointmentDate(DateTime start, DateTime end) {
            if(start <= DateTime.Now || end <= DateTime.Now) {
                throw new ArgumentException("Appointment Date must be after this moment.");
            }

            if(start >= end) {
                throw new ArgumentException("End date must be greater than start date.");
            }
            
            Start = start;
            End = end;
        }
        

        public AppointmentDate(string start, string end) {
            if(!DateTime.TryParse(start, out DateTime startDate) || !DateTime.TryParse(end, out DateTime endDate)) {
                throw new FormatException("Invalid date format. Use yyyy-MM-dd.");
            }

            if(startDate <= DateTime.Now || endDate <= DateTime.Now) {
                throw new ArgumentException("Appointment Date must be after this moment.");
            }

            if(startDate >= endDate) {
                throw new ArgumentException("End date must be greater than start date.");
            }

            Start = startDate;
            End = endDate;
        }

        override
        public bool Equals(object obj) {
            if(obj == null || GetType() != obj.GetType()) {
                return false;
            }

            var date = (AppointmentDate)obj;

            return this.Start.Date.Year == date.Start.Date.Year &&
                   this.Start.Date.Month == date.Start.Date.Month &&
                   this.Start.Date.Day == date.Start.Date.Day;
        }
    }

    public class AppointmentDateUtils {
        public static string ToString(AppointmentDate date) {
            return date.Start.ToString("yyyy-MM-dd HH:mm") + " - " + date.End.ToString("yyyy-MM-dd HH:mm");
        }

        public static AppointmentDate FromString(string date) {
            string[] dates = date.Split(" - ");
            DateTime start = DateTime.ParseExact(dates[0], "yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture);
            DateTime end = DateTime.ParseExact(dates[1], "yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture);
            return new AppointmentDate(start, end);
        }
    }
}