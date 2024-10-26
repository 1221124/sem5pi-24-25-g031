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
    
    public static string? ToString(Gender? gender)
    {
      return gender switch
      {
        Gender.MALE => "Male",
        Gender.FEMALE => "Female",
        _ => null // Return null if the gender is not set
      };
    }

    public static Gender FromString(string gender)
    {
      return gender switch
      {
        "Male" => Gender.MALE,
        "Female" => Gender.FEMALE,
        null => (Gender)(Gender?)null, // Handle null from the database
        _ => throw new ArgumentException($"Invalid gender: {gender}")
      };
    }


  }
}  

