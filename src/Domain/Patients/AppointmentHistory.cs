using Domain.Shared;

namespace Domain.Patients
{
    public class AppointmentHistory: IValueObject
    {
        public string Condition { get; set; }
        
        public AppointmentHistory(string condition)
        {
            Condition = condition;
        }
    }
    
}

