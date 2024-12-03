using System;
using System.Collections.Generic;
using DDDNetCore.Domain.Patients;
using Domain.Patients;
using Domain.Shared;
using Domain.Users;
using Xunit;

namespace DDDNetCore.Tests.Unit.Patients
{
    public class PatientMapperUnitTest
    {
        private readonly Patient _patient;
        private readonly PatientDto _patientDto;
        private readonly CreatingPatientDto _creatingPatientDto;

        public PatientMapperUnitTest()
        {
            _patient = new Patient(
                Guid.NewGuid(),
                new FullName(new Name("Guilherme"), new Name("Cruz")),
                new DateOfBirth("01/01/2000"),
                Gender.MALE,
                new MedicalRecordNumber("202411000001"),
                new ContactInformation(new Email("1220786@isep.ipp.pt"), new PhoneNumber(913455474)),
                new List<MedicalConditions>
                {
                    new MedicalConditions("Asthma"),
                    new MedicalConditions("Diabetes")
                },
                new EmergencyContact(new PhoneNumber(917699262)),
                new List<Slot>
                {
                    new Slot(new DateTime(2025, 1, 1, 8, 0, 0), new DateTime(2025, 1, 1, 8, 30, 0))
                },
                new UserId(Guid.NewGuid())
            );

            _patientDto = new PatientDto(
                Guid.NewGuid(),
                new FullName(new Name("Guilherme"), new Name("Cruz")),
                new DateOfBirth("01/01/2000"),
                Gender.MALE,
                new MedicalRecordNumber("202411000001"),
                new ContactInformation(new Email("1220786@isep.ipp.pt"), new PhoneNumber(913455474)),
                new List<MedicalConditions>
                {
                    new MedicalConditions("Asthma"),
                    new MedicalConditions("Diabetes")
                },
                new EmergencyContact(new PhoneNumber(917699262)),
                new List<Slot>
                {
                    new Slot(new DateTime(2025, 1, 1, 8, 0, 0), new DateTime(2025, 1, 1, 8, 30, 0))
                },
                new UserId(Guid.NewGuid())
            );

            _creatingPatientDto = new CreatingPatientDto(
                new FullName(new Name("Guilherme"), new Name("Cruz")),
                new DateOfBirth("01/01/2000"),
                new ContactInformation(new Email("1220786@isep.ipp.pt"), new PhoneNumber(913455474)),
                Gender.MALE
            );
        }

            [Fact]
            public void ToDto_ShouldConvertPatientToDto()
            {
                var dto = PatientMapper.ToDto(_patient);

                Assert.Equal(_patient.Id.AsGuid(), dto.Id);
                Assert.Equal(_patient.FullName, dto.FullName);
                Assert.Equal(_patient.DateOfBirth, dto.DateOfBirth);
                Assert.Equal(_patient.Gender, dto.Gender);
                Assert.Equal(_patient.MedicalRecordNumber, dto.MedicalRecordNumber);
                Assert.Equal(_patient.ContactInformation, dto.ContactInformation);
                Assert.Equal(_patient.MedicalConditions, dto.MedicalConditions);
                Assert.Equal(_patient.EmergencyContact, dto.EmergencyContact);
                Assert.Equal(_patient.AppointmentHistory, dto.AppointmentHistory);
                Assert.Equal(_patient.UserId, dto.UserId);
            }

            [Fact]
            public void ToEntityFromCreating_ShouldConvertCreatingPatientDtoToPatient()
            {
                var entity = PatientMapper.ToEntityFromCreating(_creatingPatientDto);

                Assert.NotEmpty(entity.Id.Value);
                Assert.Equal(_creatingPatientDto.Fullname, entity.FullName);
                Assert.Equal(_creatingPatientDto.BirthDate, entity.DateOfBirth);
                Assert.Equal(_creatingPatientDto.ContactInformation, entity.ContactInformation);
                Assert.Equal(_creatingPatientDto.Gender, entity.Gender);
            }

            [Fact]
            public void ToDtoList_ShouldConvertPatientListToDtoList()
            {
                var patients = new List<Patient>
                {
                    _patient
                };

                var dtoList = PatientMapper.ToDtoList(patients);

                Assert.Single(dtoList);
                Assert.Equal(_patient.Id.AsGuid(), dtoList[0].Id);
                Assert.Equal(_patient.FullName, dtoList[0].FullName);
                Assert.Equal(_patient.DateOfBirth, dtoList[0].DateOfBirth);
            }

            [Fact]
            public void ToDtoList_ShouldReturnEmptyList_WhenInputListIsEmpty()
            {
                var dtoList = PatientMapper.ToDtoList(new List<Patient>());
                
                Assert.Empty(dtoList);
            }

            [Fact]
            public void ToDtoList_ShouldReturnNull_WhenInputListIsNull()
            {
                var dtoList = PatientMapper.ToDtoList(null!);
                
                Assert.Null(dtoList);
            }

    }
    
}

