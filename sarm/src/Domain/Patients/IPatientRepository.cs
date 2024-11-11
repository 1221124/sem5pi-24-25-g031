using System.Threading.Tasks;
using DDDNetCore.Domain.Patients;
using Domain.Shared;


namespace Domain.Patients
{
    public interface IPatientRepository: IRepository<Patient, PatientId>
    {
        public Task<Patient?> GetByEmailAsync(Email email);
        public Task<Patient?> GetByPhoneNumberAsync(PhoneNumber phoneNumber);
        public Task<List<Patient?>> GetByName(Name firstName, Name lastName);
        public Task<Patient?> GetByMedicalRecordNumberAsync(MedicalRecordNumber medicalRecordNumber);
        public Task<List<Patient?>> GetByDateOfBirthAsync(DateOfBirth dateOfBirth);
        public Task<List<Patient?>> GetByGenderAsync(Gender gender);
    }
}