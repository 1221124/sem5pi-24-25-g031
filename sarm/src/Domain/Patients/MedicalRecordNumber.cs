using System;
using Domain.Shared;

namespace Domain.Patients
{
  public class MedicalRecordNumber: IValueObject
  {
    public String Value { get; private set; }

    public MedicalRecordNumber(String value)
    {
      if (string.IsNullOrWhiteSpace(value))
      {
        throw new ArgumentException("Medical Record Number cannot be empty");
      }
      Value = value;
    }

    public static implicit operator int(MedicalRecordNumber medicalRecordNumber)
    {
      return medicalRecordNumber;
    }
    
  }
}