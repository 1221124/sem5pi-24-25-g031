using Domain.Shared;

namespace Domain.Patients
{
    public class UpdatingPatientDto
    {
        public Guid Id { get; set; }
        public Name? FirstName { get; set; }
        public Name? LastName { get; set; }
        public Email? Email { get; set; }
        public PhoneNumber? PhoneNumber { get; set; }
        public AppointmentHistory? AppointmentHistory { get; set; }
        public MedicalConditions? MedicalConditions { get; set; }
        
        public UpdatingPatientDto(Name? firstName, Name? lastName, Email? email, PhoneNumber? phoneNumber, AppointmentHistory? appointmentHistory, MedicalConditions? medicalConditions)
        {
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            PhoneNumber = phoneNumber;
            AppointmentHistory = appointmentHistory;
            MedicalConditions = medicalConditions;
        }
        
        public UpdatingPatientDto(Email email)
        {
            Email = email;
        }
        
        public UpdatingPatientDto(PhoneNumber phoneNumber)
        {
            PhoneNumber = phoneNumber;
        }
        
        public UpdatingPatientDto()
        {
        }
    }
    
}

