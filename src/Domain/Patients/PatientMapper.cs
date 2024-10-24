using Domain.Shared;

namespace Domain.Patients
{
    public class PatientMapper
    {
        
        public static Patient ToEntityFromCreating(CreatingPatientDto dto)
        {
            
            return new Patient(
                dto.Fullname,
                dto.DateOfBirth,
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
    }
}

/*
Id = patient.Id.AsGuid(),
   FullName = patient.FullName,
   DateOfBirth = patient.DateOfBirth,
   ContactInformation = patient.ContactInformation,
   UserId = patient.UserId
*/