using System.Threading.Tasks;
using Domain.Shared;


namespace Domain.Patients
{
    public interface IPatientRepository: IRepository<Patient, PatientId>
    {
        public Task<Patient> getByPhoneNumberAsync(PhoneNumber phoneNumber);
    }
}