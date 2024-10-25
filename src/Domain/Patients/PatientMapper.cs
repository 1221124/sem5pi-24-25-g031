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
                dto.ContactInformation
            );
        }

        public static PatientDto ToDto(Patient patient)
        {
            return new PatientDto
            (
                patient.Id.AsGuid(),
                patient.FullName,
                patient.DateOfBirth,
                patient.ContactInformation,
                patient.UserId
            );
        }
        
        public static Patient ToEntity(UpdatingPatientDto dto)
        {
            return new Patient(
                dto.Id,
                dto.Email,
                dto.PhoneNumber
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
                dto.UserId
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