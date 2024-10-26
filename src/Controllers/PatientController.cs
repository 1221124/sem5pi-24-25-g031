using Domain.Shared;
using Microsoft.AspNetCore.Mvc;
using Domain.Patients;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Domain.DBLogs;

namespace src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController: ControllerBase
    {
        private readonly PatientService _service;
        private readonly DBLogService _dbLogService;
        
        public PatientController(PatientService service, DBLogService dbLogService)
        {
            _service = service;
            _dbLogService = dbLogService; // Certifique-se de inicializá-lo
        }

        
        private static readonly EntityType patientEntityType = EntityType.PATIENT;

        // GET: api/Patient
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }
        
        //GET: api/Patient/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDto>> GetGetById(Guid id)
        {
            var patient = await _service.GetByIdAsync(new PatientId(id));

            if (patient == null)
            {
                return NotFound();
            }

            return patient;
        }
        
        // GET: api/OperationTypes/name/{name}
        [HttpGet("name/{fullName}")]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetByName(string fullName)
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

            return patient;
        }
        
        // GET: api/Patient/getByEmail?email=gui.cr04@isep.ipp.pt
        [HttpGet("email/{email}")]
        public async Task<ActionResult<PatientDto>> GetByEmail(string email)
        {
            var patient = await _service.GetByEmailAsync(new Email(email));

            if (patient == null)
            {
                return NotFound();
            }

            return patient;
        }

        // POST: api/Patient/{ "fullname", "dateOfBirth", "contactInformation" } 
        [HttpPost]
        public async Task<ActionResult<PatientDto>> Create([FromBody] CreatingPatientDto dto)
        {
            if (dto == null)
            {
                //_dbLogService.LogError(patientEntityType, "Invalid data request");
                return BadRequest(new {Message = "Phone number already exists"});
            }
            var patient = await _service.AddAsync(PatientMapper.ToEntityFromCreating(dto)); //problema
            if (patient == null)
            {
                return BadRequest();
            }
            else
            {
                return CreatedAtAction(nameof(GetGetById), new { id = patient.Id }, patient);
            }
        }

        // PUT: api/Patient/5
        [HttpPut("{id}")]
        public async Task<ActionResult<PatientDto>> Update(UpdatingPatientDto dto)
        {
            
            try
            {
                if (dto == null)
                {
                    return BadRequest("Invalid UpdatingPatientDto");
                }
                var patient = await _service.UpdateAsync(dto);

                if (patient == null)
                {
                    return NotFound("Patient not found");
                }
                return Ok(patient);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }
        
        // DELETE: api/Patient/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> AdminDelete(Guid id)
        {
            try
            {
                var patient = await _service.PatientDeleteAsync(new PatientId(id));

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
        
        /*
        // DELETE: api/Patient/
        [HttpDelete("{id}")]
        public async Task<ActionResult> PatientDelete(Guid id)
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
        */
    }
}