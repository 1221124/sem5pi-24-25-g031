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
        public EmergencyContact? EmergencyContact { get; set; }
        public List<Slot>? AppointmentHistory { get; set; }
        public UserId? UserId { get; set; }
        public PhoneNumber? PendingPhoneNumber { get; set; }
        public Email? PendingEmail { get; set; }
        
        public UpdatingPatientDto(Email emailId,Name? firstName, Name? lastName, Email? email, PhoneNumber? phoneNumber, EmergencyContact? emergencyContact ,List<Slot>? appointmentHistory,UserId? userId)
        {
            EmailId = emailId;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            PhoneNumber = phoneNumber;
            EmergencyContact = emergencyContact;
            AppointmentHistory = appointmentHistory;
            UserId = userId;
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

