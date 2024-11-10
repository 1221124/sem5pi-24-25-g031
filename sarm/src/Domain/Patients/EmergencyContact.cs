using Domain.Shared;

namespace Domain.Patients
{
  public class EmergencyContact: IValueObject
  {
    public PhoneNumber Number { get; set; }

    public EmergencyContact(PhoneNumber number)
    {
        Number = number;
    }
    
    
  }
}