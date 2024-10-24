using System;
using System.Collections.Generic;
using Domain.Shared;
using Domain.Users;

namespace Domain.Patients
{
    public class PatientDto
    {
        public Guid Id { get; set; }
        public FullName FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public Gender? Gender { get; set; }
        public MedicalRecordNumber MedicalRecordNumber { get; set; }
        public ContactInformation ContactInformation { get; set; }
        public List<MedicalConditions> MedicalConditions { get; set; }
        public EmergencyContact EmergencyContact { get; set; }
        public UserId UserId { get; set; }

        public PatientDto(Guid id,FullName fullName, DateTime dateOfBirth, Gender? gender, MedicalRecordNumber medicalRecordNumber, ContactInformation contactInformation, List<MedicalConditions> medicalConditions, EmergencyContact emergencyContact, UserId userId)
        {
            Id = id; 
            FullName = fullName;
            DateOfBirth = dateOfBirth; 
            Gender = gender;
            MedicalRecordNumber = medicalRecordNumber;
            ContactInformation = contactInformation;
            MedicalConditions = medicalConditions;
            EmergencyContact = emergencyContact;
            //AppointmentHistory = appointmentHistory;
            UserId = userId;
        }
        
        public PatientDto (Guid id, FullName fullName, DateTime dateOfBirth, ContactInformation contactInformation, UserId userId)
        {
            Id = id;
            FullName = fullName;
            DateOfBirth = dateOfBirth; 
            ContactInformation = contactInformation;
            UserId = userId;
        }

        public PatientDto(Guid guid){
            Id = guid;
        }

        public PatientDto(PatientId id){
            Id = id.AsGuid();
        }
        /*
        public PatientDto()
        {
            
        }
        */
    }
}