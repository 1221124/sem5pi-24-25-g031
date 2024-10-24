using System;

namespace Domain.Patients
{
  public enum Gender
  {
    MALE,
    FEMALE
  }

  public class GenderUtils
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
    //Method fromString
    public static Gender FromString(string gender)
    {
      return gender switch
      {
        "Anaesthesiology" => Gender.MALE,
        "Cardiology" => Gender.FEMALE,
        _ => throw new System.ArgumentException($"Invalid gender: {gender}")
      };
    }
    
    public static string ToString(Gender? gender)
    {
      return gender switch
      {
        Gender.MALE => "Male",
        Gender.FEMALE => "Female",
        _ => throw new ArgumentException("Invalid Gender")
      };
    }

  }
}  

