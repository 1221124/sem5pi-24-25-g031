using Domain.Shared;

namespace Domain.Patients
{
    public class PatientMapper
    {
        public static Patient ToEntityFromCreating(CreatingPatientDto dto)
        {
            DateTime dt = DateTime.ParseExact(dto.DateOfBirth, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
            return new Patient(
                new FullName(dto.Fullname),
                dt,
                new ContactInformation(dto.ContactInformation)
            );
        }
    }
}

