using Domain.Shared;

namespace Domain.Patient
{
  public class MedicalConditions: IValueObject
  {
    public string Condition { get; set; }

    public MedicalConditions(string condition)
    {
      Condition = condition;
    }
  }
}