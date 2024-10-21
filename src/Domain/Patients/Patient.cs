using Domain.Shared;
using System;
using System.Collections.Generic;

namespace Domain.Patients
{
  public class Patient : Entity<PatientId>, IAggregateRoot
  {
    public FullName FullName { get; set; }
    public Name Name { get; set; }
    public DateTime DateOfBirth { get; set; }
    public Gender Gender { get; set; }
    public MedicalRecordNumber MedicalRecordNumber { get; set; }
    public ContactInformation ContactInformation { get; set; }
    public List<MedicalConditions> MedicalConditions { get; set; }
    public EmergencyContact EmergencyContact { get; set; }

    public Patient(FullName fullName, Name name, DateTime dateOfBirth, Gender gender, MedicalRecordNumber medicalRecordNumber, ContactInformation contactInformation, List<MedicalConditions> medicalConditions, EmergencyContact emergencyContact/*, AppointementHistory appointementHistory*/)
    {
      Id = new PatientId(Guid.NewGuid());
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
        
    public Patient (FullName fullName, Name name, DateTime dateOfBirth, ContactInformation contactInformation)
    {
      Id = new PatientId(Guid.NewGuid());
      FullName = fullName;
      Name = name;
      DateOfBirth = dateOfBirth; 
      ContactInformation = contactInformation;
    }

    public void ChangeFullName(FullName fullName)
    {
      this.FullName = fullName;
    }

    public void ChangeName(Name name)
    {
      this.Name = name;
    }

    public void ChangeDateOfBirth(DateTime dateOfBirth)
    {
      this.DateOfBirth = dateOfBirth;
    }

    public void ChangeGender(Gender gender)
    {
      this.Gender = gender;
    }

    public void ChangeMedicalRecordNumber(MedicalRecordNumber medicalRecordNumber)
    {
      this.MedicalRecordNumber = medicalRecordNumber;
    }

    public void ChangeContactInformation(ContactInformation contactInformation)
    {
      this.ContactInformation = contactInformation;
    }

    public void ChangeMedicalConditions(List<MedicalConditions> medicalConditions)
    {
      this.MedicalConditions = medicalConditions;
    }

    public void ChangeEmergencyContact(EmergencyContact emergencyContact)
    {
      this.EmergencyContact = emergencyContact;
    }  
  }
}