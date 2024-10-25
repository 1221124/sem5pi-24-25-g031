using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using Domain.Shared;
using Domain.Staffs;
using Infrastructure;
using System.Threading.Tasks;
using Domain.DBLogs;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly StaffService _service;

        private readonly IStaffRepository _repo;

        private readonly DBLogService _DBLogService;

        private static readonly EntityType StaffEntityType = EntityType.STAFF;

        public StaffController(StaffService service)
        {
            _service = service;
        }

        // GET: api/Staff
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        //GET: api/Staff/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StaffDto>> GetById(Guid id)
        {
            var staff = await _service.GetByIdAsync(new StaffId(id));

            if (staff == null)
            {
                return NotFound();
            }

            return staff;
        }

        //Procurar por searchCriteria
        /*[HttpGet("search")]
        public async Task<ActionResult<StaffDto>> GetBySearchCriteria(CreatingStaffDto staffDto)
        {
            if (staffDto == null)
            {
                return BadRequest("Parâmetros de pesquisa inválidos.");
            }

        }*/

        // POST: api/Staff
        [HttpPost]
        public async Task<ActionResult<StaffDto>> Create([FromBody] CreatingStaffDto staffDto)
        {
            try
            {
                if (staffDto == null)
                {
                    //_DBLogService.LogError(StaffEntityType, "Invalid data request.");
                    return BadRequest("Invalid request data.");
                }

                var staff = await _service.AddAsync(StaffMapper.ToEntityFromCreating(staffDto));

                return CreatedAtAction(nameof(GetById), new { id = staff.Id }, staff);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }

        }

        // PUT: api/Staff/5
        [HttpPut("update/email={email}")]
        public async Task<ActionResult<StaffDto>> Update(UpdatingStaffDto dto)
        {
            if (dto == null)
            {
                _DBLogService.LogError(EntityType.STAFF, "Staff data is required.");
                return BadRequest("Staff data is required.");
            }

            await _service.UpdateAsync(StaffMapper.ToEntityFromUpdating(dto));

            return Ok("Staff request updated successfully.");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<StaffDto>> SoftDelete(Guid id)
        {
            var staff = await _service.InactivateAsync(new StaffId(id));

            if (staff == null)
            {
                return NotFound();
            }

            return Ok(staff);
        }

        // DELETE: api/Staff/5
        [HttpDelete("{id}/hard")]
        public async Task<ActionResult<StaffDto>> HardDelete(Guid id)
        {
            try
            {
                var staff = await _service.DeleteAsync(new StaffId(id));

                if (staff == null)
                {
                    return NotFound();
                }

                return Ok(staff);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}