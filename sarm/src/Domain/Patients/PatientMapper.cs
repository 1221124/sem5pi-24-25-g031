using DDDNetCore.Domain.Patients;
using Domain.Shared;

namespace Domain.Patients
{
    public class PatientMapper
    {
        
        public static Patient ToEntityFromCreating(CreatingPatientDto dto)
        {
            
            return new Patient(
                dto.Fullname,
                dto.BirthDate,
                dto.ContactInformation,
                dto.Gender
            );
        }
        
        public static UpdatingPatientDto ToUpdatingPatientDto(PatientDto dto)
        {
            return new UpdatingPatientDto
            (
                dto.ContactInformation.Email,
                dto.FullName.FirstName,
                dto.FullName.LastName,
                dto.ContactInformation.Email,
                dto.ContactInformation.PhoneNumber,
                dto.AppointmentHistory,
                dto.MedicalConditions,
                dto.UserId,
                dto.VerificationToken,
                dto.TokenExpiryDate
            );
        }
        public static List<PatientDto> toDtoList(List<Patient> patients)
        {
            return patients.ConvertAll(patient=> ToDto(patient));
        }

        public static PatientDto ToDto(Patient patient)
        {
            return new PatientDto
            (
                patient.Id.AsGuid(),
                patient.FullName,
                patient.DateOfBirth,
                patient.Gender,
                patient.MedicalRecordNumber,
                patient.ContactInformation,
                patient.MedicalConditions,
                patient.EmergencyContact,
                patient.UserId,
                patient.VerificationToken,
                patient.TokenExpiryDate
            );
        }
        
        public static Patient ToEntity(UpdatingPatientDto dto)
        {
            return new Patient(
                dto.Id,
                dto.FirstName,
                dto.LastName,
                dto.Email,
                dto.PhoneNumber,
                dto.AppointmentHistory,
                dto.MedicalConditions,
                dto.VerificationToken,
                dto.TokenExpiryDate
            );
        }

        public static Patient ToEntity(PatientDto dto)
        {
            return new Patient(
                dto.Id,
                dto.FullName,
                dto.DateOfBirth,
                dto.Gender,
                dto.MedicalRecordNumber,
                dto.ContactInformation,
                dto.MedicalConditions,
                dto.EmergencyContact,
                dto.AppointmentHistory,
                dto.UserId,
                dto.VerificationToken,
                dto.TokenExpiryDate
            );
        }
    }
}

/*
Id = patient.Id.AsGuid(),
   FullName = patient.FullName,
   DateOfBirth = patient.DateOfBirth,
   ContactInformation = patient.ContactInformation,
   UserId = patient.UserId
*/