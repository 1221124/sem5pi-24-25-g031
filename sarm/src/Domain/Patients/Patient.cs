using DDDNetCore.Domain.Appointments;
using Domain.Patients;
using Domain.Shared;
using Domain.Users;

namespace DDDNetCore.Domain.Patients
{
  public class Patient : Entity<PatientId>, IAggregateRoot
  {
    public FullName FullName { get; set; }
    public DateOfBirth DateOfBirth { get; set; }
    public Gender? Gender { get; set; }
    public MedicalRecordNumber? MedicalRecordNumber { get; set; }
    public ContactInformation ContactInformation { get; set; }
    public List<MedicalConditions>? MedicalConditions { get; set; }
    public EmergencyContact? EmergencyContact { get; set; }
    public List<Slot> AppointmentHistory { get; set; }
    public UserId? UserId { get; set; }

    public Patient() { }
    
    public Patient(FullName fullName, DateOfBirth dateOfBirth, Gender? gender,MedicalRecordNumber medicalRecordNumber, ContactInformation contactInformation, List<MedicalConditions> medicalConditions, EmergencyContact emergencyContact,  UserId userId)
    {
      Id = new PatientId(Guid.NewGuid());
      FullName = fullName;
      DateOfBirth = dateOfBirth; 
      Gender = gender;
      MedicalRecordNumber = medicalRecordNumber;
      ContactInformation = contactInformation;
      MedicalConditions = medicalConditions;
      EmergencyContact = emergencyContact;
      AppointmentHistory = new List<Slot>();
      UserId = userId;
    }
    
    public Patient(Guid guid ,FullName fullName, DateOfBirth dateOfBirth, Gender? gender,MedicalRecordNumber medicalRecordNumber, ContactInformation contactInformation, List<MedicalConditions> medicalConditions, EmergencyContact emergencyContact,  UserId userId)
    {
      Id = new PatientId(guid);
      FullName = fullName;
      DateOfBirth = dateOfBirth; 
      Gender = gender;
      MedicalRecordNumber = medicalRecordNumber;
      ContactInformation = contactInformation;
      MedicalConditions = medicalConditions;
      EmergencyContact = emergencyContact;
      AppointmentHistory = new List<Slot>();
      UserId = userId;
    }
    
    public Patient(Guid guid ,FullName fullName, DateOfBirth dateOfBirth, Gender? gender,MedicalRecordNumber medicalRecordNumber, ContactInformation contactInformation, List<MedicalConditions> medicalConditions, EmergencyContact emergencyContact, List<Slot> appointmentHistory, UserId userId)
    {
      Id = new PatientId(guid);
      FullName = fullName;
      DateOfBirth = dateOfBirth; 
      Gender = gender;
      MedicalRecordNumber = medicalRecordNumber;
      ContactInformation = contactInformation;
      MedicalConditions = medicalConditions;
      EmergencyContact = emergencyContact;
      AppointmentHistory = appointmentHistory;
      UserId = userId;
    }
    
    public Patient(FullName fullName, DateOfBirth dateOfBirth, Gender? gender,MedicalRecordNumber medicalRecordNumber, ContactInformation contactInformation, List<MedicalConditions> medicalConditions, EmergencyContact emergencyContact, List<Slot> appointmentHistory, UserId userId)
    {
      Id = new PatientId(Guid.NewGuid());
      FullName = fullName;
      DateOfBirth = dateOfBirth; 
      Gender = gender;
      MedicalRecordNumber = medicalRecordNumber;
      ContactInformation = contactInformation;
      MedicalConditions = medicalConditions;
      EmergencyContact = emergencyContact;
      AppointmentHistory = appointmentHistory;
      UserId = userId;
    }
        
    public Patient (FullName fullName, DateOfBirth dateOfBirth,MedicalRecordNumber medicalRecordNumber, ContactInformation contactInformation)
    {
      if (fullName == null || contactInformation == null)
      {
        throw new ArgumentNullException("FullName or ContactInformation cannot be null.");
      }
      
      Id = new PatientId(Guid.NewGuid());
      FullName = fullName;
      DateOfBirth = dateOfBirth; 
      MedicalRecordNumber = medicalRecordNumber;
      ContactInformation = contactInformation;
    }

    public Patient(FullName fullName, DateOfBirth dateOfBirth, ContactInformation contactInformation, Gender gender)
    {
      Id = new PatientId(Guid.NewGuid());
      FullName = fullName;
      DateOfBirth = dateOfBirth; 
      ContactInformation = contactInformation;
      Gender = gender;
    }

    public Patient(Guid guid, Email email, PhoneNumber phoneNumber)
    {
      Id = new PatientId(guid);
      ContactInformation = new ContactInformation(email, phoneNumber);
    }
    
    public Patient(Guid guid, Name FirstName, Name LastName, Email email, PhoneNumber phoneNumber, List<MedicalConditions> medicalConditions)
    {
      Id = new PatientId(guid);
      FullName = new FullName(FirstName, LastName);
      ContactInformation = new ContactInformation(email, phoneNumber);
      AppointmentHistory = new List<Slot>();
      MedicalConditions = medicalConditions;
    }
    
    public override string ToString()
    {
      return $"{Id};{FullName};{DateOfBirth:yyyy-MM-dd};{Gender};{MedicalRecordNumber};{ContactInformation};{string.Join(",", MedicalConditions.Select(m => m.ToString()))};{EmergencyContact};{AppointmentHistory};{UserId}";
    }
    
    public void ChangeFullName(FullName fullName)
    {
      if (fullName == null)
      {
        throw new ArgumentNullException("FullName is null.");
      }
      this.FullName = fullName;
    }
    

    public void ChangeDateOfBirth(DateOfBirth dateOfBirth)
    {
      if (dateOfBirth == null)
      {
        throw new ArgumentNullException("DateOfBirth is null.");
      }
      this.DateOfBirth = dateOfBirth;
    }
    public void ChangeMedicalRecordNumber(MedicalRecordNumber medicalRecordNumber)
    {
      if (medicalRecordNumber == null)
      {
        throw new ArgumentNullException("MedicalRecordNumber is null.");
      }
      this.MedicalRecordNumber = medicalRecordNumber;
    }

    public void ChangeGender(Gender? gender)
    {
      if (gender == null)
      {
        throw new ArgumentNullException("Gender is null.");
      }
      this.Gender = gender;
    }

    public void ChangeContactInformation(ContactInformation contactInformation)
    {
      if(contactInformation == null)
      {
        throw new ArgumentNullException("ContactInformation is null");
      }

      if (contactInformation.PhoneNumber != null)
      {
        this.ContactInformation.PhoneNumber = contactInformation.PhoneNumber;
      }

      if (contactInformation.Email != null)
      {
        this.ContactInformation.Email = contactInformation.Email;
      }
      {
        
      }
    }

    public void ChangeMedicalConditions(List<MedicalConditions> medicalConditions)
    {
      if (medicalConditions == null)
      {
        throw new ArgumentNullException("MedicalConditions is null.");
      }
      this.MedicalConditions = medicalConditions;
    }

    public void ChangeEmergencyContact(EmergencyContact emergencyContact)
    {
      if (emergencyContact == null)
      {
        throw new ArgumentNullException("EmergencyContact is null.");
      }
      this.EmergencyContact = emergencyContact;
    }  
    
    public void ChangeAppointmentHistory(List<Slot> appointmentHistory)
    {
      if (appointmentHistory == null)
      {
        throw new ArgumentNullException("AppointmentHistory is null.");
      }
      this.AppointmentHistory = appointmentHistory;
    }
    
    public void ChangeUserId(UserId userId)
    {
      if (userId == null)
      {
        throw new ArgumentNullException("UserId is null.");
      }
      this.UserId = userId;
    }

    public void UpdatePatient(Patient p)
    {
      if (p.FullName.FirstName != null)
      {
        this.FullName.FirstName = p.FullName.FirstName;
      }
      if (p.FullName.LastName != null)
      {
        this.FullName.LastName = p.FullName.LastName;
      }
      if (p.ContactInformation.PhoneNumber != null)
      {
        this.ContactInformation.PhoneNumber = p.ContactInformation.PhoneNumber;
      }
      if (p.ContactInformation.Email != null)
      {
        this.ContactInformation.Email = p.ContactInformation.Email;
      }
      if (p.MedicalConditions != null)
      {
        this.MedicalConditions = p.MedicalConditions;
      }
      if (p.AppointmentHistory != null)
      {
        this.AppointmentHistory = p.AppointmentHistory;
      }
      if (p.UserId != null)
      {
        this.UserId = p.UserId;
      }
    }

        public void AddAppointmentHistory(Slot appointment)
        {
            if (appointment == null)
            {
                throw new ArgumentNullException("Appointment is null.");
            }

            if (AppointmentHistory == null)
            {
                AppointmentHistory = new List<Slot>();
            }

            AppointmentHistory.Add(appointment);
        }
    }
}