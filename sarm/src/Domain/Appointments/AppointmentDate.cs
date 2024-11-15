using Domain.Shared;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace DDDNetCore.Domain.Appointments{
    public class AppointmentDate : IValueObject{
        public DateTime Date { get; private set; }

        public AppointmentDate(DateTime date){
            if(date <= DateTime.Now){
                throw new ArgumentException("Appointment Date must be greater than today");
            }

            var dateonly = date.Date;

            Date = new DateTime(dateonly.Year, dateonly.Month, dateonly.Day, 0, 0 , 0);
        }
        

        public AppointmentDate(string date){
            if(!DateTime.TryParse(date, out DateTime appointmentDate)){
                throw new FormatException("Invalid date format. Use yyyy-MM-dd.");
            }
            
            if(appointmentDate <= DateTime.Now){
                throw new ArgumentException("Appointment Date must be greater than today");
            }

            Date = appointmentDate;
        }

        //update time

        public void UpdateTime(DateTime time){
            Date = new DateTime(this.Date.Year, this.Date.Month, this.Date.Day, time.Hour, time.Minute, time.Second);
        }
    }
}