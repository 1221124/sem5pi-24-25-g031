using System;
using System.Collections.Generic;
using DDDNetCore.Domain.Patients;
using Domain.Patients;
using Domain.Shared;
using Domain.Users;
using Xunit;

namespace DDDNetCore.Tests.Unit.Domain.Patients
{
        public class PatientUnitTest
        {
            
            private readonly FullName _fullName;
            private readonly DateOfBirth _dateOfBirth;
            private readonly Gender _gender;
            private readonly MedicalRecordNumber _medicalRecordNumber;
            private readonly ContactInformation _contactInformation;
            private readonly List<MedicalConditions> _medicalConditions;
            private readonly EmergencyContact _emergencyContact;
            private readonly List<Slot> _appointmentHistory;
            private readonly UserId _userId;

            public PatientUnitTest()
            {
                _fullName = new FullName("John", "Doe");
                _dateOfBirth = new DateOfBirth("01/01/2000");
                _gender = Gender.MALE;
                _medicalRecordNumber = new MedicalRecordNumber("202411000001");
                _contactInformation = new ContactInformation(new Email("gui.cr04@gmail.com"), new PhoneNumber(913455474));
                _medicalConditions = new List<MedicalConditions>
                {
                    new MedicalConditions("Asthma"),
                    new MedicalConditions("Diabetes")
                };
                _emergencyContact = new EmergencyContact(new PhoneNumber(913455477));
                _appointmentHistory = new List<Slot>
                {
                    new Slot(new DateTime(2025, 1, 1, 8, 0, 0), new DateTime(2025, 1, 1, 8, 30, 0)),
                    new Slot(new DateTime(2025, 1, 1, 9, 0, 0), new DateTime(2025, 1, 1, 9, 30, 0))
                };
                _userId = new UserId(Guid.NewGuid());
            }

            [Fact]
            public void Construcutor_WithAllParameters_ShouldInitializeProperties()
            {
                var id = Guid.NewGuid();
                var patient = new Patient(id, _fullName, _dateOfBirth, _gender, _medicalRecordNumber, _contactInformation, _medicalConditions, _emergencyContact, _appointmentHistory,_userId);
                
                Assert.Equal(new PatientId(id), patient.Id);
                Assert.Equal(_fullName, patient.FullName);
                Assert.Equal(_dateOfBirth, patient.DateOfBirth);
                Assert.Equal(_gender, patient.Gender);
                Assert.Equal(_medicalRecordNumber, patient.MedicalRecordNumber);
                Assert.Equal(_contactInformation, patient.ContactInformation);
                Assert.Equal(_medicalConditions, patient.MedicalConditions);
                Assert.Equal(_emergencyContact, patient.EmergencyContact);
                Assert.Equal(_appointmentHistory, patient.AppointmentHistory);
            }

            [Fact]
            public void Construcutor_WithoutId_ShouldGenerateNewId()
            {
                var patient = new Patient(_fullName, _dateOfBirth, _gender, _medicalRecordNumber, _contactInformation,
                    _medicalConditions, _emergencyContact, _appointmentHistory, _userId);
                
                Assert.NotEmpty(patient.Id.Value);
                Assert.Equal(_fullName, patient.FullName);
                Assert.Equal(_dateOfBirth, patient.DateOfBirth);
                Assert.Equal(_gender, patient.Gender);
                Assert.Equal(_medicalRecordNumber, patient.MedicalRecordNumber);
                Assert.Equal(_contactInformation, patient.ContactInformation);
                Assert.Equal(_medicalConditions, patient.MedicalConditions);
                Assert.Equal(_emergencyContact, patient.EmergencyContact);
                Assert.Equal(_appointmentHistory, patient.AppointmentHistory);
            }

            [Fact]
            public void Constructor_WithoutAppointmentHistory_ShouldInitializeProperties()
            {
                var patient = new Patient(_fullName, _dateOfBirth, _gender, _medicalRecordNumber, _contactInformation,
                    _medicalConditions, _emergencyContact, _userId);

                Assert.NotEmpty(patient.Id.Value);
                Assert.Equal(_fullName, patient.FullName);
                Assert.Equal(_dateOfBirth, patient.DateOfBirth);
                Assert.Equal(_gender, patient.Gender);
                Assert.Equal(_medicalRecordNumber, patient.MedicalRecordNumber);
                Assert.Equal(_contactInformation, patient.ContactInformation);
                Assert.Equal(_medicalConditions, patient.MedicalConditions);
                Assert.Equal(_emergencyContact, patient.EmergencyContact);
                Assert.Empty(patient.AppointmentHistory);
            }

            [Fact]
            public void PropertyAssignment_ShouldAssignCorrectly()
            {
                var patient = new Patient(_fullName, _dateOfBirth, _gender, _medicalRecordNumber, _contactInformation,
                    _medicalConditions, _emergencyContact, _appointmentHistory, _userId);
                var newFullName = new FullName("Jane", "Doe");
                var newDateOfBirth = new DateOfBirth("01/01/2001");
                var newGender = Gender.FEMALE;
                var newMedicalRecordNumber = new MedicalRecordNumber("202411000002");
                var newContactInformation =
                    new ContactInformation(new Email("12220786@isep.ipp.pt"), new PhoneNumber(913488292));
                var newMedicalConditions = new List<MedicalConditions>
                {
                    new MedicalConditions("Asthma"),
                    new MedicalConditions("Diabetes")
                };
                var newEmergencyContact = new EmergencyContact(new PhoneNumber(913455477));
                var newAppointmentHistory = new List<Slot>
                {
                    new Slot(new DateTime(2025, 1, 1, 8, 0, 0), new DateTime(2025, 1, 1, 8, 30, 0)),
                    new Slot(new DateTime(2025, 1, 1, 9, 0, 0), new DateTime(2025, 1, 1, 9, 30, 0))
                };
                var newUserId = new UserId(Guid.NewGuid());
                
                patient.FullName = newFullName;
                patient.DateOfBirth = newDateOfBirth;
                patient.Gender = newGender;
                patient.MedicalRecordNumber = newMedicalRecordNumber;
                patient.ContactInformation = newContactInformation;
                patient.MedicalConditions = newMedicalConditions;
                patient.EmergencyContact = newEmergencyContact;
                patient.AppointmentHistory = newAppointmentHistory;
                patient.UserId = newUserId;
                
                Assert.Equal(newFullName, patient.FullName);
                Assert.Equal(newDateOfBirth, patient.DateOfBirth);
                Assert.Equal(newGender, patient.Gender);
                Assert.Equal(newMedicalRecordNumber, patient.MedicalRecordNumber);
                Assert.Equal(newContactInformation, patient.ContactInformation);
                Assert.Equal(newMedicalConditions, patient.MedicalConditions);
                Assert.Equal(newEmergencyContact, patient.EmergencyContact);
                Assert.Equal(newAppointmentHistory, patient.AppointmentHistory);
                Assert.Equal(newUserId, patient.UserId);
            }
        }
}


