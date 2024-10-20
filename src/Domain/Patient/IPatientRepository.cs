using Domain.Shared;

namespace Domain.Patient
{
    public interface IPatientRepository: IRepository<Patient, PatientId>
    {
    }
}