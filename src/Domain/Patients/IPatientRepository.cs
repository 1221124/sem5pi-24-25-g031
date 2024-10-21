using Domain.Shared;

namespace Domain.Patients
{
    public interface IPatientRepository: IRepository<Patient, PatientId>
    {
    }
}