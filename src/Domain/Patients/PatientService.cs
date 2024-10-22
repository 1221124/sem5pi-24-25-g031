using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Domain.DBLogs;
using Domain.Shared;
using FirebaseAdmin.Auth;

namespace Domain.Patients
{
    public class PatientService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPatientRepository _repo;
        private readonly DBLogService _dbLogService;

        public PatientService(IUnitOfWork unitOfWork, IPatientRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<PatientDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            
            List<PatientDto> listDto = list.ConvertAll(static patient => new PatientDto (patient.Id.AsGuid(), patient.FullName, patient.DateOfBirth, patient.Gender, patient.MedicalRecordNumber, patient.ContactInformation, patient.MedicalConditions, patient.EmergencyContact, patient.UserId ));

            return listDto;
        }

        public async Task<PatientDto> GetByIdAsync(PatientId id)
        {
            var patient = await this._repo.GetByIdAsync(id);
            
            if(patient == null)
                return null;

            return new PatientDto (patient.Id.AsGuid(), patient.FullName, patient.DateOfBirth, patient.Gender, patient.MedicalRecordNumber, patient.ContactInformation, patient.MedicalConditions, patient.EmergencyContact, patient.UserId );
        }

        public async Task<PatientDto> AddAsync(CreatingPatientDto dto)
        {
            if(_repo.getByPhoneNumberAsync(dto.ContactInformation.PhoneNumber) != null)
                return null;
            
            var numberPatients = _repo.GetAllAsync().Result.Count;
            string formattedDate = DateTime.Now.ToString("yyyyMM");
            string combinedString = $"{formattedDate}{numberPatients:D6}";  // Combine the date and zero-padded number
            
            MedicalRecordNumber medicalRecordNumber = new MedicalRecordNumber(combinedString);
            
            var patient = new Patient(dto.FullName, dto.DateOfBirth, medicalRecordNumber, dto.ContactInformation, dto.UserId);
            
            
            await this._repo.AddAsync(patient);

            await this._unitOfWork.CommitAsync();
            
            _dbLogService.LogAction(EntityType.PATIENT, DBLogType.CREATE, patient.Id );

            return new PatientDto (patient.Id.AsGuid(), patient.FullName, patient.DateOfBirth, patient.Gender, patient.MedicalRecordNumber, patient.ContactInformation, patient.MedicalConditions, patient.EmergencyContact, patient.UserId );
        }

        public async Task<PatientDto> UpdateAsync(PatientDto dto)
        {
            var patient = await this._repo.GetByIdAsync(new PatientId(dto.Id)); 

            if (patient == null)
                return null;   

            // change all field
            patient.ChangeFullName(dto.FullName);
            patient.ChangeDateOfBirth(dto.DateOfBirth);
            patient.ChangeGender(dto.Gender);
            patient.ChangeContactInformation(dto.ContactInformation);
            patient.ChangeMedicalConditions(dto.MedicalConditions);
            patient.ChangeEmergencyContact(dto.EmergencyContact);

            await this._unitOfWork.CommitAsync();

            return new PatientDto (patient.Id.AsGuid(), patient.FullName, patient.DateOfBirth, patient.Gender, patient.MedicalRecordNumber, patient.ContactInformation, patient.MedicalConditions, patient.EmergencyContact, patient.UserId );
        }

        public async Task<PatientDto> DeleteAsync(PatientId id)
        {
            var patient = await this._repo.GetByIdAsync(id); 

            if (patient == null)
                return null;   

            this._repo.Remove(patient);
            await this._unitOfWork.CommitAsync();

            return new PatientDto (patient.Id.AsGuid(), patient.FullName, patient.DateOfBirth, patient.Gender, patient.MedicalRecordNumber, patient.ContactInformation, patient.MedicalConditions, patient.EmergencyContact, patient.UserId );
        }    
    }
}