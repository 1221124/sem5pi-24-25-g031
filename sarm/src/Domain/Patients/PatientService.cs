using System.Diagnostics;
using Domain.DbLogs;
using Domain.Emails;
using Domain.Patients;
using Domain.Shared;
using Domain.Users;
using Microsoft.AspNetCore.Mvc;
using Sendinblue.Api.Business;
using DateTime = System.DateTime;
using Date = System.DateOnly;
using PhoneNumber = Domain.Shared.PhoneNumber;
using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.OperationRequests;

namespace DDDNetCore.Domain.Patients
{
    public class PatientService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPatientRepository _repo;
        private readonly DbLogService _dbLogService;
        //private readonly UserService _userService;
        private readonly IEmailService _emailService;
        private const int PageSize = 2;

        public PatientService(IUnitOfWork unitOfWork, IPatientRepository repo, DbLogService dbLogService,/* UserService userService,*/ IEmailService emailService)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            _dbLogService = dbLogService;
            //_userService = userService;
            _emailService = emailService;
        }

        public async Task<List<PatientDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            
            //List<PatientDto> listDto = list.ConvertAll(static patient => new PatientDto (patient.Id.AsGuid(), patient.FullName, patient.DateOfBirth, patient.Gender, patient.MedicalRecordNumber, patient.ContactInformation, patient.MedicalConditions, patient.EmergencyContact, patient.UserId ));

            return PatientMapper.ToDtoList(list);
            //return listDto;
        }
        

        public async Task<PatientDto> GetByIdAsync(PatientId id)
        {
            var patient = await this._repo.GetByIdAsync(id);
            
            if(patient == null)
                return null;

            //return new PatientDto (patient.Id.AsGuid(), patient.FullName, patient.DateOfBirth, patient.Gender, patient.MedicalRecordNumber, patient.ContactInformation, patient.MedicalConditions, patient.EmergencyContact, patient.UserId );
            
            return PatientMapper.ToDto(patient);
        }

        public async Task<List<PatientDto>> GetByNameAsync(FullName name)
        {
            try
            {
                var listPatient = await _repo.GetByName(new Name(name.FirstName), new Name(name.LastName));

                if (listPatient == null)
                    return null;
                
                List<PatientDto> listDto = PatientMapper.ToDtoList(listPatient);

                return listDto;

            }catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return null;
            }
        
        }

        public async Task<PatientDto> GetByEmailAsync(Email email)
        {
            try
            {
                var patient = await this._repo.GetByEmailAsync(email);
            
                if(patient == null)
                    return null;

                return PatientMapper.ToDto(patient);
            }catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return null;
            }
            
        }
        
        public async Task<PatientDto> GetByPhoneNumberAsync(PhoneNumber phoneNumber)
        {
            try
            {
                var patient = await this._repo.GetByPhoneNumberAsync(phoneNumber);
            
                if(patient == null)
                    return null;

                return PatientMapper.ToDto(patient);
            }catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return null;
            }
            
        }
        
        public async Task<PatientDto> GetByMedicalRecordNumberAsync(MedicalRecordNumber medicalRecordNumber)
        {
            try
            {
                var patient = await this._repo.GetByMedicalRecordNumberAsync(medicalRecordNumber);
            
                if(patient == null)
                    return null;

                return PatientMapper.ToDto(patient);
            }catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return null;
            }
        }
        
        public async Task<List<PatientDto>> GetByDateOfBirthAsync(Date dateOfBirth)
        {
            try
            {
                var listPatient = await _repo.GetByDateOfBirthAsync(new DateOfBirth(dateOfBirth));

                if (listPatient == null)
                    return null;
                
                List<PatientDto> listDto = PatientMapper.ToDtoList(listPatient);

                return listDto;

            }catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return null;
            }
        }

        public async Task<List<PatientDto>> GetByGenderAsync(Gender gender)
        {
            try
            {
                var listPatient = await _repo.GetByGenderAsync(gender);

                if (listPatient == null)
                    return null;

                List<PatientDto> listDto = PatientMapper.ToDtoList(listPatient);

                return listDto;

            }catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return null;
            }
        }
        
        public async Task<List<PatientDto?>?> SearchByFilterAsync([FromQuery] string? fullName, string? email, string? phoneNumber, string? medicalRecordNumber, string? dateOfBirth, string? gender, string? pageNumber)
        {
            try
            {
                     // Initialize a base query
                List<PatientDto?>? patientsQuery = (await GetAllAsync())!;
    
                // Filter by fullName if provided
                if (!string.IsNullOrEmpty(fullName))
                {
                    var names = fullName.Split("-");
                    if (names.Length != 2)
                    {
                        return null;
                    }
    
                    var firstName = names[0];
                    var lastName = names[1];
                    patientsQuery = patientsQuery
                        .Where(p => p.FullName.FirstName == firstName && p.FullName.LastName == lastName)
                        .ToList();
                }
    
                // Filter by gender if provided
                if (!string.IsNullOrEmpty(gender))
                {
                    patientsQuery = patientsQuery
                        .Where(p => p.Gender.Equals(GenderUtils.FromString(gender)))
                        .ToList();
                }
    
                // Filter by email if provided
                if (!string.IsNullOrEmpty(email))
                {
                    patientsQuery = patientsQuery
                        .Where(p => p.ContactInformation.Email.Value == email)
                        .ToList();
                }
    
                // Filter by phone number if provided
                if (!string.IsNullOrEmpty(phoneNumber))
                {
                    patientsQuery = patientsQuery
                        .Where(p => p.ContactInformation.PhoneNumber.Value == new PhoneNumber(phoneNumber).Value)
                        .ToList();
                }
    
                // Filter by medical record number if provided
                if (!string.IsNullOrEmpty(medicalRecordNumber))
                {
                    patientsQuery = patientsQuery
                        .Where(p => p.MedicalRecordNumber.Value == medicalRecordNumber)
                        .ToList();
                }
    
                // Filter by date of birth if provided
                if (!string.IsNullOrEmpty(dateOfBirth))
                {
                        patientsQuery = patientsQuery
                            .Where(p => p.DateOfBirth.Equals(new DateOfBirth(dateOfBirth)))
                            .ToList();
                }
                
                if (patientsQuery.Count != 0)
                {
                    if (pageNumber != null && int.TryParse(pageNumber, out int page))
                    {
                        var paginatedPatients = patientsQuery
                            .Skip((page - 1) * PageSize)
                            .Take(PageSize)
                            .ToList();
                        return paginatedPatients;
                    }

                    return patientsQuery;
            
                }

                return null;

            }catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return null;
            }
        }
        
        public async Task<PatientDto?> AddAsync(Patient p)
        {
            var listPatients = _repo.GetAllAsync();
            var greatestNumber = 0;

            for (int i = 0; i < listPatients.Result.Count; i++)
            {
                var strMedicalRecordNumber = listPatients.Result[i].MedicalRecordNumber?.Value;
                var medicalRecordNumberString = strMedicalRecordNumber?.Substring(strMedicalRecordNumber.Length - 6);
                if (medicalRecordNumberString != null)
                {
                    var medicalRecordNumberNumber = int.Parse(medicalRecordNumberString);
                    if(medicalRecordNumberNumber > greatestNumber)
                    {
                        greatestNumber = medicalRecordNumberNumber;
                    }
                }
            }
            greatestNumber++;

            var formattedDate = DateTime.Now.ToString("yyyyMM");
            var combinedString = $"{formattedDate}{greatestNumber:D6}";  // Combine the date and zero-padded number
                
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
                
                return PatientMapper.ToDto(p);
                //return new PatientDto (p.Id.AsGuid(), p.FullName, p.DateOfBirth, p.Gender, medicalRecordNumber, p.ContactInformation, p.MedicalConditions, p.EmergencyContact, p.UserId, p.VerificationToken, p.TokenExpiryDate);
            }catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return null;
            }
            
        }

        public async Task<PatientDto?> AdminUpdateAsync(UpdatingPatientDto dto)
        {
            try
            {
                var patient = await _repo.GetByEmailAsync(dto.EmailId); //ainda tem os argumentos antigos

                if (patient == null)
                {
                    await _dbLogService.LogAction(EntityType.Patient, DbLogType.Update, "Unable to update because Patient not found");
                    return null;
                }
                
                if(dto.EmergencyContact != null)
                    patient.ChangeEmergencyContact(dto.EmergencyContact);
                
                if(dto.MedicalConditions != null)
                    patient.ChangeMedicalConditions(dto.MedicalConditions);
            
                if(dto is { FirstName: not null, LastName: not null })
                        patient.ChangeFullName(new FullName(dto.FirstName, dto.LastName));

                if(dto.AppointmentHistory != null)
                    patient.ChangeAppointmentHistory(dto.AppointmentHistory);
            
                await _unitOfWork.CommitAsync();
            
                if (dto.PhoneNumber != null && dto.PhoneNumber != patient.ContactInformation.PhoneNumber)
                {
                    var phoneNumberToCheck = dto.PhoneNumber;
                    var byPhoneNumberAsync = await _repo.GetByPhoneNumberAsync(phoneNumberToCheck);
                    if (byPhoneNumberAsync != null)
                    {
                        throw new Exception("Phone number already exists");
                    }
                }
                if (dto.Email != null && !dto.Email.Equals(patient.ContactInformation.Email))
                {
                    var emailToCheck = dto.Email;
                    var byEmailAsync = await _repo.GetByEmailAsync(emailToCheck);
                    if (byEmailAsync != null)
                    {
                        throw new Exception("Email already exists");
                    } 
                }

                if (dto.PhoneNumber != null && patient.ContactInformation.PhoneNumber != dto.PhoneNumber)
                {
                    dto.PendingPhoneNumber = dto.PhoneNumber;
                }
                if(dto.Email != null && !patient.ContactInformation.Email.Equals(dto.Email)) 
                {
                    dto.PendingEmail = dto.Email;
                }
                
                await _dbLogService.LogAction(EntityType.Patient, DbLogType.Update, "Updated {" + patient.Id.Value + "}");
                return PatientMapper.ToDto(patient);
                
            }catch(Exception e)
            {
                await _dbLogService.LogAction(EntityType.Patient, DbLogType.Update, e.Message);
                return null;
            }
        }
        
        
        
        public async Task<PatientDto> PatientDeleteAsync(PatientId id)
        {
            try
            {
                var patient = await this._repo.GetByIdAsync(id); 
            
                if (patient == null)
                    return null;

                var dto = PatientMapper.ToDto(patient);
                var creatingPatientDto = PatientMapper.ToUpdatingPatientDto(dto);
                    
                var (subject, body) = await _emailService.GenerateVerificationRemoveEmailContentSensitiveInfo(creatingPatientDto);
                await _emailService.SendEmailAsync(creatingPatientDto.EmailId.Value, subject, body);
                
                return PatientMapper.ToDto(patient);
            }
            catch (Exception e)
            {
                _dbLogService.LogAction(EntityType.Patient, DbLogType.Delete, e.Message);
                await _unitOfWork.CommitAsync();
                return null;
            }
        }    
        
        public async Task<PatientDto> AdminDeleteAsync(PatientId id)
        {
            var patient = await _repo.GetByIdAsync(id); 
            
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
             
            return PatientMapper.ToDto(patient);
        }

        public async Task<PatientDto?> DeleteAsync(PatientId patientId)
        {
            try
            {
                if(patientId == null)
                    return null;
                
                var patient = await _repo.GetByIdAsync(patientId);
                
                if (patientId == null)
                    return null;

                _repo.Remove(patient);
                await _unitOfWork.CommitAsync();
                
                return PatientMapper.ToDto(patient);
            }catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return null;
            }
            
        }

        public async Task<bool> AddAppointmentHistory(Dictionary<AppointmentDto, OperationRequestDto> appointmentRequests)
        {
            try {
                foreach (var appointment in appointmentRequests.Keys)
                {
                    var patient = await _repo.GetByMedicalRecordNumberAsync(appointmentRequests[appointment].Patient);
                    if (patient == null) return false;
                    patient.AddAppointmentHistory(appointment.AppointmentDate);
                }
                return true;
            } catch (Exception e) {
                Console.WriteLine(e.Message);
                return false;
            }
        }
    }
    
}