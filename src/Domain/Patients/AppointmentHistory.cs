using Domain.Shared;

namespace Domain.Patients
{
    public class AppointmentHistory: IValueObject
    {
        public List<string> Condition { get; set; }
        
        public AppointmentHistory(List<string> condition){
            Condition = condition;
        }
    }
    
}

