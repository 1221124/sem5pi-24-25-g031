using Domain.Patients;
using Domain.Shared;
using Domain.Users;

namespace DDDNetCore.Domain.Patients
{
    public class UpdatingPatientDto
    {
        public Guid Id { get; set; }
        public Email EmailId { get; set; }
        public Name? FirstName { get; set; }
        public Name? LastName { get; set; }
        public Email? Email { get; set; }
        public DateOfBirth? DateOfBirth { get; set; }
        public Gender? Gender { get; set; }
        public PhoneNumber? PhoneNumber { get; set; }
        public AppointmentHistory? AppointmentHistory { get; set; }
        public List<MedicalConditions>? MedicalConditions { get; set; }
        public UserId? UserId { get; set; }
        public string? VerificationToken { get;  set; }
        public DateTime? TokenExpiryDate { get;  set; }
        public PhoneNumber? PendingPhoneNumber { get; set; }
        public Email? PendingEmail { get; set; }
        
        public UpdatingPatientDto(Email emailId,Name? firstName, Name? lastName, Email? email, PhoneNumber? phoneNumber, AppointmentHistory? appointmentHistory, List<MedicalConditions>? medicalConditions, UserId? userId, string? verificationToken, DateTime? tokenExpiryDate)
        {
            EmailId = emailId;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            PhoneNumber = phoneNumber;
            AppointmentHistory = appointmentHistory;
            MedicalConditions = medicalConditions;
            UserId = userId;
            VerificationToken = verificationToken;
            TokenExpiryDate = tokenExpiryDate;
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

