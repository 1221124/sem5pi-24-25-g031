using System;

namespace Domain.Patient
{
  public enum Gender
  {
    MALE,
    FEMALE
  }

  public class GenderName
  {
    public static string Get(Gender gender)
    {
      switch(gender){
        case Gender.FEMALE:
          return "Female";
        case Gender.MALE:
          return "Male";
        default:
          throw new ArgumentException("Invalid Gender");
      }
    }
  }
}  

