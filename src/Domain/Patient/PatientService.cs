using System.Threading.Tasks;
using System.Collections.Generic;
using Domain.Shared;

namespace Domain.Patient
{
    public class PatientService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPatientRepository _repo;

        public PatientService(IUnitOfWork unitOfWork, IPatientRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<PatientDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            
            List<PatientDto> listDto = list.ConvertAll<PatientDto>(static patient => new PatientDto{Id = patient.Id.AsGuid(), FullName = patient.FullName, Name = patient.Name, DateOfBirth = patient.DateOfBirth, Gender = patient.Gender, ContactInformation = patient.ContactInformation, MedicalConditions = patient.MedicalConditions, EmergencyContact = patient.EmergencyContact});

            return listDto;
        }

        public async Task<PatientDto> GetByIdAsync(PatientId id)
        {
            var patient = await this._repo.GetByIdAsync(id);
            
            if(patient == null)
                return null;

            return new PatientDto{Id = patient.Id.AsGuid(), FullName = patient.FullName, Name = patient.Name, DateOfBirth = patient.DateOfBirth, Gender = patient.Gender, ContactInformation = patient.ContactInformation, MedicalConditions = patient.MedicalConditions, EmergencyContact = patient.EmergencyContact};
        }

        public async Task<PatientDto> AddAsync(CreatingPatientDto dto)
        {
            var patient = new Patient(dto.FullName, dto.Name, dto.DateOfBirth, dto.Gender, dto.MedicalRecordNumber, dto.ContactInformation, dto.MedicalConditions, dto.EmergencyContact);

            await this._repo.AddAsync(patient);

            await this._unitOfWork.CommitAsync();

            return new PatientDto { Id = patient.Id.AsGuid(), FullName = patient.FullName, Name = patient.Name, DateOfBirth = patient.DateOfBirth, Gender = patient.Gender, ContactInformation = patient.ContactInformation, MedicalConditions = patient.MedicalConditions, EmergencyContact = patient.EmergencyContact };
        }

        public async Task<PatientDto> UpdateAsync(PatientDto dto)
        {
            var patient = await this._repo.GetByIdAsync(new PatientId(dto.Id)); 

            if (patient == null)
                return null;   

            // change all field
            patient.ChangeFullName(dto.FullName);
            patient.ChangeName(dto.Name);
            patient.ChangeDateOfBirth(dto.DateOfBirth);
            patient.ChangeGender(dto.Gender);
            patient.ChangeMedicalRecordNumber(dto.MedicalRecordNumber);
            patient.ChangeContactInformation(dto.ContactInformation);
            patient.ChangeMedicalRecordNumber(dto.MedicalRecordNumber);
            patient.ChangeContactInformation(dto.ContactInformation);
            patient.ChangeMedicalConditions(dto.MedicalConditions);
            patient.ChangeEmergencyContact(dto.EmergencyContact);

            await this._unitOfWork.CommitAsync();

            return new PatientDto { Id = patient.Id.AsGuid(), FullName = patient.FullName, Name = patient.Name, DateOfBirth = patient.DateOfBirth, Gender = patient.Gender, ContactInformation = patient.ContactInformation, MedicalConditions = patient.MedicalConditions, EmergencyContact = patient.EmergencyContact };
        }

        public async Task<PatientDto> DeleteAsync(PatientId id)
        {
            var patient = await this._repo.GetByIdAsync(id); 

            if (patient == null)
                return null;   

            this._repo.Remove(patient);
            await this._unitOfWork.CommitAsync();

            return new PatientDto { Id = patient.Id.AsGuid(), FullName = patient.FullName, Name = patient.Name, DateOfBirth = patient.DateOfBirth, Gender = patient.Gender, ContactInformation = patient.ContactInformation, MedicalConditions = patient.MedicalConditions, EmergencyContact = patient.EmergencyContact };
        }    
    }
}