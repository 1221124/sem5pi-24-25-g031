using Domain.Shared;

namespace Domain.Patients
{
    public class AppointmentHistory: IValueObject
    {
        public List<Slot> Condition { get; set; }
        
        public AppointmentHistory() { }

        public AppointmentHistory(List<Slot> condition){
            Condition = condition;
        }
    }
    
}

