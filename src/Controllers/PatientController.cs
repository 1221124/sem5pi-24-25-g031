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
        public async Task<ActionResult> Delete(Guid id)
        {
            try
            {
                var patient = await _service.DeleteAsync(new PatientId(id));

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