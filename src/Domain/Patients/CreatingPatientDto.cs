using System;
using System.Collections.Generic;
using Domain.Shared;

namespace Domain.Patients {

    public class CreatingPatientDto{
        public FullName FullName { get; set; }
        public Name Name { get; set; }
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public MedicalRecordNumber MedicalRecordNumber { get; set; }
        public ContactInformation ContactInformation { get; set; }
        public List<MedicalConditions> MedicalConditions { get; set; }
        public EmergencyContact EmergencyContact { get; set; }
        //public AppointmentHistory AppointementHistory { get; set; }

        public CreatingPatientDto(FullName fullName, Name name, DateTime dateOfBirth, Gender gender, MedicalRecordNumber medicalRecordNumber, ContactInformation contactInformation, List<MedicalConditions> medicalConditions, EmergencyContact emergencyContact/*, AppointementHistory appointementHistory*/)
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
    }
}