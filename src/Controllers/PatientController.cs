using Domain.Shared;
using Microsoft.AspNetCore.Mvc;
using Domain.Patients;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController: ControllerBase
    {
        private readonly PatientService _service;

        public PatientController(PatientService service)
        {
            _service = service;
        }

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

        // POST: api/Patient
        [HttpPost]
        public async Task<ActionResult<PatientDto>> Create(CreatingPatientDto dto)
        {
            var patient = await _service.AddAsync(dto);
            
            if (patient == null)
            {
                return BadRequest(new {Message = "Phone number already exists"});
            }

            return CreatedAtAction(nameof(GetGetById), new { id = patient.Id }, patient);
        }

        // PUT: api/Patient/5
        [HttpPut("{id}")]
        public async Task<ActionResult<PatientDto>> Update(Guid id, PatientDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var patient = await _service.UpdateAsync(dto);

                if (patient == null)
                {
                    return NotFound();
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