using System;
using Domain.Shared;

namespace Domain.Patient
{
  public class MedicalRecordNumber: IValueObject
  {
    public int Value { get; private set; }

    public MedicalRecordNumber(int value)
    {
      if (value <= 0)
        {
            throw new ArgumentException("Medical Record Number must be greater than zero");
        }
      Value = value;
    }

    public static implicit operator int(MedicalRecordNumber medicalRecordNumber)
    {
      return medicalRecordNumber.Value;
    }

    public static implicit operator MedicalRecordNumber(int value)
    {
      return new MedicalRecordNumber(value);
    }
  }
}