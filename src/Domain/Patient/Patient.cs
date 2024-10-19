namespace DDDNetCore.src.Domain.Patient
{
  public class Patient : Entity<PatientId>, IAggregateRoot
  {
    //public FullName FullName { get; set; }
    //public Name Name { get; set; }
    public DateTime DateOfbirth { get; set; }
    public Gender Gender { get; set; }
    public ContactInformation ContactInformation { get; set; }
    public List<MedicalConditions> MedicalConditions { get; set; }
    public EmergencyContact EmergencyContact { get; set; }
    public AppointmentHistory AppointementHistory { get; set; }

    public Patient(FullName fullName, Name name, DateTime dateOfBirth, Gender gender, ContactInformation contactInformation, MedicalConditions medicalConditions, EmergencyContact emergencyContact, AppointementHistory appointementHistory)
    {
      FullName = fullName;
      Name = name;
      DateOfbirth = dateOfBirth; 
      Gender = gender;
      ContactInformation = contactInformation;
      MedicalConditions = medicalConditions;
      EmergencyContact = emergencyContact;
      AppointmentHistory = appointmentHistory;
    }
  }
}