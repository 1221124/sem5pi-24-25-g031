using Domain.Shared;

namespace Domain.Patient
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