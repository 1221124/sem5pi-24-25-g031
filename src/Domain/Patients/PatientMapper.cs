using Domain.Shared;

namespace Domain.Patients
{
    public class PatientMapper
    {
        public static Patient toEntityFromCreating(CreatingPatientDto dto)
        {
            DateTime dt = DateTime.ParseExact(dto.dateOfBirth, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
            return new Patient(
                new FullName(dto.firstName, dto.lastName),
                dt,
                new ContactInformation(dto.email, new PhoneNumber(dto.phoneNumber))
            );
        }
    }
}

