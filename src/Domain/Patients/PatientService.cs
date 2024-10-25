using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Domain.Emails;
using Domain.DBLogs;
using Domain.Shared;
using Domain.Users;
using FirebaseAdmin.Auth;

namespace Domain.Patients
{
    public class PatientService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPatientRepository _repo;
        private readonly DBLogService _dbLogService;
        private readonly UserService _userService;

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

        public async Task<PatientDto> GetByEmailAsync(Email email)
        {
            var patient = await this._repo.GetByEmailAsync(email);
            
            if(patient == null)
                return null;

            return new PatientDto (patient.Id.AsGuid(), patient.FullName, patient.DateOfBirth, patient.Gender, patient.MedicalRecordNumber, patient.ContactInformation, patient.MedicalConditions, patient.EmergencyContact, patient.UserId );
        }

        public async Task<PatientDto> AddAsync(Patient p)
        {
            var numberPatients = _repo.GetAllAsync().Result.Count;
            string formattedDate = DateTime.Now.ToString("yyyyMM");
            string combinedString = $"{formattedDate}{numberPatients:D6}";  // Combine the date and zero-padded number
                
            MedicalRecordNumber medicalRecordNumber = new MedicalRecordNumber(combinedString);
            p.ChangeMedicalRecordNumber(medicalRecordNumber);
            try
            {
                if(_repo.getByPhoneNumberAsync(p.ContactInformation.PhoneNumber) == null)
                    return null;
                
                await _repo.AddAsync(p);
                await _unitOfWork.CommitAsync();
                
                //_dbLogService.LogAction(EntityType.PATIENT, DBLogType.CREATE, p.Id );
            }catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
            
            return new PatientDto (p.Id.AsGuid(), p.FullName, p.DateOfBirth, p.Gender, medicalRecordNumber, p.ContactInformation, p.MedicalConditions, p.EmergencyContact, p.UserId );
        }
        
        /*
        private Patient PatientDtoPatient(CreatingPatientDto dto)
        {
            return new Patient(new FullName(dto.FullName.FirstName, dto.FullName.LastName), DateTime.Parse(dto.DateOfBirth), new ContactInformation(dto.ContactInformation.Email, dto.ContactInformation.PhoneNumber));

        }
        */

        public async Task<PatientDto> UpdateAsync(Patient p)
        {
            var patient = await this._repo.GetByIdAsync(p.Id); 

            if (patient == null)
                return null;   

            
            patient.ChangeContactInformation(p.ContactInformation);

            await _unitOfWork.CommitAsync();

            return new PatientDto (patient.Id.AsGuid(), patient.FullName, patient.DateOfBirth, patient.Gender, patient.MedicalRecordNumber, patient.ContactInformation, patient.MedicalConditions, patient.EmergencyContact, patient.UserId );
        }

        public async Task<PatientDto> DeleteAsync(PatientId id)
        {
            //sends email to confirm the action
            var patient = await this._repo.GetByIdAsync(id); 
            
            //var emailService = new EmailService("smtp.gmail.com", 587, "gui.cr04@gmail.com", "your-password");
            //await emailService.SendEmailAsync(patient.ContactInformation.Email, "Subject of the email", "Body of the email");
            
            if (patient == null)
                return null;

            await Task.Run(async () =>
            {
                await Task.Delay(TimeSpan.FromMinutes(1));
                
                this._repo.Remove(patient);
                await this._unitOfWork.CommitAsync();
                _dbLogService.LogAction(EntityType.PATIENT, DBLogType.DELETE, patient.Id );
                //var emailService = new EmailService("smtp.gmail.com", 587, "gui.cr04@gmail.com", "your-password");
                //await emailService.SendEmailAsync(patient.ContactInformation.Email, "Subject of the email", "Body of the email");
            });
    
            return new PatientDto (patient.Id.AsGuid(), patient.FullName, patient.DateOfBirth, patient.Gender, patient.MedicalRecordNumber, patient.ContactInformation, patient.MedicalConditions, patient.EmergencyContact, patient.UserId );
        }    
    }
}