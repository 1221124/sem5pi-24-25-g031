using Domain.Shared;

namespace Domain.Patients
{
    public class UpdatingPatientDto
    {
        public Guid Id { get; set; }
        public FullName FullName { get; set; }
        public ContactInformation ContactInformation { get; set; }
        public AppointmentHistory AppointmentHistory { get; set; }
        public MedicalConditions MedicalConditions { get; set; }
        
        public UpdatingPatientDto(FullName fullName, ContactInformation contactInformation, AppointmentHistory appointmentHistory, MedicalConditions medicalConditions)
        {
            FullName = fullName;
            ContactInformation = contactInformation;
            AppointmentHistory = appointmentHistory;
            MedicalConditions = medicalConditions;
        }
        
        public UpdatingPatientDto(Guid id, ContactInformation contactInformation)
        {
            Id = id;
            ContactInformation = contactInformation;
        }
    }
    
}

