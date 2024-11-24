using DDDNetCore.Domain.Patients;
using Domain.DbLogs;
using Domain.Emails;
using Domain.Patients;
using Domain.Shared;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DDDNetCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController: ControllerBase
    {
        private const int PageSize = 2;
        private readonly PatientService _service;
        private readonly IEmailService _emailService;
        
        private readonly DbLogService _dbLogService;
        private readonly IUnitOfWork _unitOfWork;
        
        public PatientController(PatientService service, DbLogService dbLogService, IUnitOfWork unitOfWork, EmailService emailService)
        {
            _service = service;
            _dbLogService = dbLogService;
            _unitOfWork = unitOfWork;
            _emailService = emailService;
        }

        
        private static readonly EntityType PatientEntityType = EntityType.Patient;

        // GET: api/Patient/?pageNumber=1
        [HttpGet]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetAll([FromQuery] string? pageNumber)
        {
            var patients = await _service.GetAllAsync();
            
            if (patients == null)
            {
                return NotFound();
            }

            if (pageNumber != null && int.TryParse(pageNumber, out int page))
            {
                var paginatedPatients = patients
                    .Skip((page - 1) * PageSize)
                    .Take(PageSize)
                    .ToList();
                return paginatedPatients;
            }

            return Ok(patients);

        }
        
        //GET: api/Patient/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<PatientDto>> GetGetById(Guid id)
        {
            var patient = await _service.GetByIdAsync(new PatientId(id));

            if (patient == null)
            {
                return NotFound();
            }
            
            return patient;
        }
        
        /*
        // GET: api/Patient/name/{name}/?pageNumber=1
        [HttpGet("name/{fullName}")]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetByName(string fullName, int pageNumber)
        {
            
            var names = fullName.Split("-");

            if (names.Length != 2)
            {
                return BadRequest("Full name format is invalid. Expected format: FirstName%2LastName");
            }

            var firstName = names[0];
            var lastName = names[1];
            
            var patient = await _service.GetByNameAsync(new FullName(new Name(firstName), new Name(lastName)));

            if (patient == null)
            {
                return NotFound();
            }
            
            var paginatedPatients = patient
                .Skip((pageNumber - 1) * PageSize) // Pula os primeiros itens de acordo com o número da página e o tamanho da página
                .Take(PageSize)                    // Seleciona a quantidade especificada de itens para a página atual
                .ToList();                         // Converte o resultado em uma lista para fácil manipulação
            
            return paginatedPatients;
        }
         */
        // GET: api/Patient/email/?email={email}
        [HttpGet("email")]
        [Authorize(Roles = "Admin,Doctor,Patient")]
        public async Task<ActionResult<PatientDto>> GetByEmail([FromQuery] string? email)
        {
            if (email != null)
            {
                var patient = await _service.GetByEmailAsync(new Email(email));

                if (patient != null)
                {
                    return Ok(new { patient = patient});;
                }
            }
            
            return BadRequest();
            
        }
        /*
        // GET: api/Patient/phoneNumber/{phoneNumber}
        [HttpGet("phoneNumber/{phoneNumber}")]
        public async Task<ActionResult<PatientDto>> GetByPhoneNumber(string phoneNumber)
        {
            var patient = await _service.GetByPhoneNumberAsync(new PhoneNumber(phoneNumber));

            if (patient == null)
            {
                return NotFound();
            }

            return patient;
        }
        
        //GET: api/Patient/medicalRecordNumber/{medicalRecordNumber}
        [HttpGet("medicalRecordNumber/{medicalRecordNumber}")]
        public async Task<ActionResult<PatientDto>> GetByMedicalRecordNumber(string medicalRecordNumber)
        {
            var patient = await _service.GetByMedicalRecordNumberAsync(new MedicalRecordNumber(medicalRecordNumber));

            if (patient == null)
            {
                return NotFound();
            }

            return patient;
        }
        
        //GET: api/Patient/dateOfBirth/{dateOfBirth}/?pageNumber=1
        [HttpGet("dateOfBirth/{dateOfBirth}")]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetByDateOfBirth(string dateOfBirth, int pageNumber)
        {
            var patient = await _service.GetByDateOfBirthAsync(Date.Parse(dateOfBirth));

            if (patient == null)
                
            {
                return NotFound();
            }
            
            var paginatedPatients = patient
                .Skip((pageNumber - 1) * PageSize) // Pula os primeiros itens de acordo com o número da página e o tamanho da página
                .Take(PageSize)                    // Seleciona a quantidade especificada de itens para a página atual
                .ToList();                         // Converte o resultado em uma lista para fácil manipulação

            return paginatedPatients;
        }
        
        //GET: api/Patient/gender/{gender}/?pageNumber=1
        [HttpGet("gender/{gender}")]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetByGender(string gender, int pageNumber)
        {
            var patient = await _service.GetByGenderAsync(GenderUtils.FromString(gender));
            
            if(patient == null)
            {
                return NotFound();
            }
            
            var paginatedPatients = patient
                .Skip((pageNumber - 1) * PageSize) // Pula os primeiros itens de acordo com o número da página e o tamanho da página
                .Take(PageSize)                    // Seleciona a quantidade especificada de itens para a página atual
                .ToList();                         // Converte o resultado em uma lista para fácil manipulação

            return paginatedPatients;
        }
        */
        
        //GET: api/Patient/filter/?fullName={fullName}&email={email}&phoneNumber={phoneNumber}&medicalRecordNumber={medicalRecorsNumber}&dateOfBirth={dateOfBirth}&gender={gender}&pageNumber={pageNumber}
        [HttpGet("filter")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<IEnumerable<PatientDto>>> SearchByFilter([FromQuery] string? fullName,
                                                                                [FromQuery] string? email, 
                                                                                [FromQuery] string? phoneNumber, 
                                                                                [FromQuery] string? medicalRecordNumber,
                                                                                [FromQuery] string? dateOfBirth, 
                                                                                [FromQuery] string? gender,
                                                                                [FromQuery] string? pageNumber)
        {
            // Initialize a base query

            List<PatientDto> patientsQuery = await _service.SearchByFilterAsync(fullName, email, phoneNumber, medicalRecordNumber, dateOfBirth, gender, pageNumber);
            
            if(patientsQuery == null)
            {
                return NotFound("Patients not found with that search criteria");
            }

            var patientCount = patientsQuery.Count;

            return Ok(new { patient = patientsQuery, totalItems = patientCount });

        }
        

        // POST: api/Patient/{ "fullname", "dateOfBirth", "contactInformation" } 
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PatientDto>> Create([FromBody] CreatingPatientDto dto)
        {
            if (dto == null)
            {
                //_dbLogService.LogError(patientEntityType, "Invalid data request");
                return BadRequest(new {Message = "Phone number already exists"});
            }
            var patient = await _service.AddAsync(PatientMapper.ToEntityFromCreating(dto));
            if (patient == null)
            {
                return BadRequest();
            }
            else
            {
                return CreatedAtAction(nameof(GetGetById), new { id = patient.Id }, patient);
            }
        }

        // PUT: api/Patient/
        [HttpPut]
        [Authorize(Roles = "Admin,Patient")]
        public async Task<ActionResult<PatientDto>> Update(UpdatingPatientDto dto)
        {
            try
            {
                if (dto == null)
                {
                    await _dbLogService.LogAction( EntityType.Patient, DbLogType.Update, "Patient data is required.");
                    return BadRequest("Invalid UpdatingPatientDto");
                }
                var patient = await _service.AdminUpdateAsync(dto);

                if (patient == null)
                {
                    return NotFound("Patient not found");
                }

                if (dto.PendingPhoneNumber == null && dto.PendingEmail == null) return Ok(new { patient = patient });
                
                var (subject, body) = await _emailService.GenerateVerificationEmailContentSensitiveInfo(dto);
                await _emailService.SendEmailAsync(dto.EmailId.Value, subject, body);

                return Ok(new { patient = patient });
            }
            catch (BusinessRuleValidationException ex)
            {
                await _dbLogService.LogAction(EntityType.Patient, DbLogType.Update, ex.Message);
                return BadRequest(new {ex.Message});
            }
        }
        
        //GET: api/Patients/sensitiveInfo/?email={email}&token={token}&pendingPhoneNumber={phoneNumber}&pendingEmail={newEmail}
        [HttpGet("sensitiveInfo")]
        public async Task<ActionResult<PatientDto>> VerifySensitiveInfo([FromQuery] string token, [FromQuery] string? pendingPhoneNumber, [FromQuery] string? pendingEmail)
        {
            var email = _emailService.DecodeToken(token);
            
            var patientDto = await _service.GetByEmailAsync(new Email(email));

            var patient =  PatientMapper.ToEntity(patientDto);
            
            if (!string.IsNullOrEmpty(pendingPhoneNumber))
            {
                patient.ContactInformation.PhoneNumber = new PhoneNumber(pendingPhoneNumber);
            }
            if (!string.IsNullOrEmpty(pendingEmail))
            {
                patient.ContactInformation.Email = pendingEmail;
            }
            
            await _unitOfWork.CommitAsync();
            var patientDto2 = PatientMapper.ToDto(patient);
            
            return Ok (new {patient = patientDto2});
        }

        
        
        // DELETE: api/Patient/patient/5
        [HttpDelete("patient/{id}")]
        [Authorize(Roles = "Patient")]
        public async Task<ActionResult> PatientDelete(Guid id)
        {
            try
            {
                var patient = await _service.PatientDeleteAsync(new PatientId(id));

                if (patient == null)
                {
                    await _dbLogService.LogAction(EntityType.Patient, DbLogType.Delete, "Patient not found");
                    await _unitOfWork.CommitAsync();
                    return NotFound();
                }
                return Ok(patient);
            }
            catch (BusinessRuleValidationException ex)
            {
                await _dbLogService.LogAction(EntityType.Patient, DbLogType.Delete, ex.Message);
                await _unitOfWork.CommitAsync();
                return BadRequest(new { ex.Message });
            }
        }
        
        //GET: api/Patient/removePatient/?token={token}
        [HttpGet("removePatient")]
        public async Task<ActionResult<PatientDto>> VerifySensitiveRemoveInfo([FromQuery] string token)
        {
            var email = _emailService.DecodeToken(token);
            
            var patientDto = await _service.GetByEmailAsync(new Email(email));

            await _service.DeleteAsync(new PatientId(patientDto.Id));
            await _dbLogService.LogAction(EntityType.Patient, DbLogType.Delete, "Deleted {" + new PatientId(patientDto.Id).Value + "}");

            return Ok(patientDto);
        }

        
        // DELETE: api/Patient/admin/5
        //[Authorize(Roles = "Admin")]
        [HttpDelete("admin/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> AdminDelete(Guid id)
        {
            try
            {
                var patient = await _service.AdminDeleteAsync(new PatientId(id));

                if (patient == null)
                {
                    return NotFound();
                }
                return Ok(patient);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
        
    }
}