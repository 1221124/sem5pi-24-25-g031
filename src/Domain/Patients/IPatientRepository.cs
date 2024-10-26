using System.Threading.Tasks;
using Domain.Shared;


namespace Domain.Patients
{
    public interface IPatientRepository: IRepository<Patient, PatientId>
    {
        public Task<Patient?> GetByEmailAsync(Email email);
        public Task<Patient?> GetByPhoneNumberAsync(PhoneNumber phoneNumber);
        public Task<List<Patient>> GetByName(Name firstName, Name lastName);
    }
}