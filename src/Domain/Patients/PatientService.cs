using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Domain.Emails;
using Domain.DBLogs;
using Domain.Shared;
using Domain.Users;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Http.HttpResults;

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

        public async Task<PatientDto?> AddAsync(Patient p)
        {
            var numberPatients = _repo.GetAllAsync().Result.Count;
            string formattedDate = DateTime.Now.ToString("yyyyMM");
            string combinedString = $"{formattedDate}{numberPatients:D6}";  // Combine the date and zero-padded number
                
            MedicalRecordNumber medicalRecordNumber = new MedicalRecordNumber(combinedString);
            p.ChangeMedicalRecordNumber(medicalRecordNumber);
            try
            {
                var phoneNumberToCheck = p.ContactInformation.PhoneNumber;
                var byPhoneNumberAsync = await _repo.GetByPhoneNumberAsync(phoneNumberToCheck);
                if (byPhoneNumberAsync != null)
                {
                    throw new Exception("Phone number already exists");
                }
                var emailToCheck = p.ContactInformation.Email;
                var byEmailAsync = await _repo.GetByEmailAsync(emailToCheck);
                if (byEmailAsync != null)
                {
                    throw new Exception("Email already exists");
                }
                
                await _repo.AddAsync(p);
                await _unitOfWork.CommitAsync();
                
                //_dbLogService.LogAction(EntityType.PATIENT, DBLogType.CREATE, p.Id );
                
                return new PatientDto (p.Id.AsGuid(), p.FullName, p.DateOfBirth, p.Gender, medicalRecordNumber, p.ContactInformation, p.MedicalConditions, p.EmergencyContact, p.UserId );
            }catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return null;
            }
            
        }

        public async Task<PatientDto?> UpdateAsync(UpdatingPatientDto dto)
        {
            var patient = await _repo.GetByEmailAsync(dto.EmailId); 

            if (patient == null)
                return null;   
            try
            {
                if (dto.PhoneNumber != null)
                {
                    var phoneNumberToCheck = dto.PhoneNumber;
                    var byPhoneNumberAsync = await _repo.GetByPhoneNumberAsync(phoneNumberToCheck);
                    if (byPhoneNumberAsync != null)
                    {
                        throw new Exception("Phone number already exists");
                    }
                }

                if (dto.Email != null)
                {
                    var emailToCheck = dto.Email;
                    var byEmailAsync = await _repo.GetByEmailAsync(emailToCheck);
                    if (byEmailAsync != null)
                    {
                        
                        throw new Exception("Email already exists");
                    } 
                }

                patient.UpdatePatient(PatientMapper.ToEntity(dto));
                await _unitOfWork.CommitAsync();
                //_dbLogService.LogAction(EntityType.PATIENT, DBLogType.UPDATE, patient.Id.AsGuid() );
                return new PatientDto (patient.Id.AsGuid(), patient.FullName, patient.DateOfBirth, patient.Gender, patient.MedicalRecordNumber, patient.ContactInformation, patient.MedicalConditions, patient.EmergencyContact, patient.UserId );
            }catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return null;
            }
        }

        public async Task<PatientDto> PatientDeleteAsync(PatientId id)
        {
            var patient = await this._repo.GetByIdAsync(id); 
            
            if (patient == null)
                return null;
            
            _repo.Remove(patient);
            await _unitOfWork.CommitAsync();
            //_dbLogService.LogAction(EntityType.PATIENT, DBLogType.DELETE, patient);
            //var emailService = new EmailService("smtp.gmail.com", 587, "gui.cr04@gmail.com", "your-password");
            //await emailService.SendEmailAsync(patient.ContactInformation.Email, "Subject of the email", "Body of the email");
            
            return PatientMapper.ToDto(patient);
        }    
        
        public async Task<PatientDto> AdminDeleteAsync(PatientId id)
        {
            var patient = await this._repo.GetByIdAsync(id); 
            
            if (patient == null)
                return null;
            try
            {
                //var emailService = new EmailService("smtp.gmail.com", 587, "gui.cr04@gmail.com", "your-password");
                //await emailService.SendEmailAsync(patient.ContactInformation.Email, "Subject of the email", "Body of the email");
            }catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
            _repo.Remove(patient);
            await _unitOfWork.CommitAsync();
            
            //_dbLogService.LogAction(EntityType.PATIENT, DBLogType.INACTIVATE, patient);
            //var emailService = new EmailService("smtp.gmail.com", 587, "gui.cr04@gmail.com", "your-password");
            //await emailService.SendEmailAsync(patient.ContactInformation.Email, "Subject of the email", "Body of the email");
            
            return PatientMapper.ToDto(patient);
        }
    }
}