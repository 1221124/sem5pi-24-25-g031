using Domain.Shared;

namespace Domain.Patients
{
    public class UpdatingPatientDto
    {
        public Guid Id { get; set; }
        public Email EmailId { get; set; }
        public Name? FirstName { get; set; }
        public Name? LastName { get; set; }
        public Email? Email { get; set; }
        public PhoneNumber? PhoneNumber { get; set; }
        public AppointmentHistory? AppointmentHistory { get; set; }
        public List<MedicalConditions>? MedicalConditions { get; set; }
        
        public UpdatingPatientDto(Email emailId,Name? firstName, Name? lastName, Email? email, PhoneNumber? phoneNumber, AppointmentHistory? appointmentHistory, List<MedicalConditions>? medicalConditions)
        {
            EmailId = emailId;
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
        
        public UpdatingPatientDto(Email email, PhoneNumber phoneNumber)
        {
            Email = email;
            PhoneNumber = phoneNumber;
        }
        
        public UpdatingPatientDto()
        {
        }
    }
    
}

