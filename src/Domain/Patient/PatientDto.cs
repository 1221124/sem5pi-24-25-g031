using Domain.Shared;

namespace Domain.Patient
{
    public class PatientDto
    {
        public Guid Id { get; set; }
        public FullName FullName { get; set; }
        public Name Name { get; set; }
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public MedicalRecordNumber MedicalRecordNumber { get; set; }
        public ContactInformation ContactInformation { get; set; }
        public List<MedicalConditions> MedicalConditions { get; set; }
        public EmergencyContact EmergencyContact { get; set; }
        //public AppointmentHistory AppointementHistory { get; set; }

        public Patient(FullName fullName, Name name, DateTime dateOfBirth, Gender gender, MedicalRecordNumber medicalRecordNumber, ContactInformation contactInformation, MedicalConditions medicalConditions, EmergencyContact emergencyContact/*, AppointementHistory appointementHistory*/)
        {
            FullName = fullName;
            Name = name;
            DateOfBirth = dateOfBirth; 
            Gender = gender;
            MedicalRecordNumber = medicalRecordNumber;
            ContactInformation = contactInformation;
            MedicalConditions = medicalConditions;
            EmergencyContact = emergencyContact;
            //AppointmentHistory = appointmentHistory;
        }

        public PatientDto(Guid guid){
            Id = guid;
        }

        public PatientDto(PatientId id){
            Id = id.asGuid();
        }
    }
}