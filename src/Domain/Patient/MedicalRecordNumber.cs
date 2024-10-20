namespace Domain.Patient
{
  public class MedicalRecordNumber: IValueObject
  {
    public int Value { get; private set; }

    public MedicalRecordNumber(int value)
    {
      if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Medical Record Number cannot be empty");
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