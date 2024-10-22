using Domain.Shared;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Domain.Patients
{
  public class Patient : Entity<PatientId>, IAggregateRoot
  {
    public FullName FullName { get; set; }
    public DateTime DateOfBirth { get; set; }
    public Gender Gender { get; set; }
    //public MedicalRecordNumber MedicalRecordNumber { get; set; }
    public ContactInformation ContactInformation { get; set; }
    public List<MedicalConditions> MedicalConditions { get; set; }
    public EmergencyContact EmergencyContact { get; set; }

    public Patient() { }
    
    public Patient(FullName fullName, DateTime dateOfBirth, Gender gender/*,MedicalRecordNumber medicalRecordNumber*/, ContactInformation contactInformation, List<MedicalConditions> medicalConditions, EmergencyContact emergencyContact/*, AppointementHistory appointementHistory*/)
    {
      Id = new PatientId(Guid.NewGuid());
      FullName = fullName;
      DateOfBirth = dateOfBirth; 
      Gender = gender;
      //MedicalRecordNumber = medicalRecordNumber;
      ContactInformation = contactInformation;
      MedicalConditions = medicalConditions;
      EmergencyContact = emergencyContact;
      //AppointmentHistory = appointmentHistory;
    }
        
    public Patient (FullName fullName, DateTime dateOfBirth, ContactInformation contactInformation)
    {
      Id = new PatientId(Guid.NewGuid());
      
      FullName = fullName;
      DateOfBirth = dateOfBirth; 
      ContactInformation = contactInformation;
    }
    
    public override string ToString()
    {
      return $"{Id};{FullName};{DateOfBirth:yyyy-MM-dd};{Gender};{ContactInformation};{string.Join(",", MedicalConditions.Select(m => m.ToString()))};{EmergencyContact}";
    }
    
    public void ChangeFullName(FullName fullName)
    {
      this.FullName = fullName;
    }
    

    public void ChangeDateOfBirth(DateTime dateOfBirth)
    {
      this.DateOfBirth = dateOfBirth;
    }

    public void ChangeGender(Gender gender)
    {
      this.Gender = gender;
    }
  
    /*
    public void ChangeMedicalRecordNumber(MedicalRecordNumber medicalRecordNumber)
    {
      this.MedicalRecordNumber = medicalRecordNumber;
    }
    */

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