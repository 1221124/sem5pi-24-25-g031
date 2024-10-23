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
        public async Task<ActionResult<StaffDto>> GetGetById(Guid id)
        {
            var staff = await _service.GetByIdAsync(new StaffId(id));

            if (staff == null)
            {
                return NotFound();
            }

            return staff;
        }

        // POST: api/Staff
        [HttpPost]
        public async Task<ActionResult<StaffDto>> Create(CreatingStaffDto staffDto)
        {
            if (staffDto == null)
            {
                _DBLogService.LogError(StaffEntityType, "Invalid data request.");
                return BadRequest("Invalid request data.");
            }

            await _service.AddAsync(StaffMapper.ToEntityFromCreating(staffDto));

            return Ok("Staff created successfully.");
        }

        // PUT: api/Staff/5
        [HttpPost("{id}")]
        public async Task<ActionResult<StaffDto>> Update(CreatingStaffDto dto)
        {
            if (dto == null)
            {
                _DBLogService.LogError(EntityType.STAFF, "Staff data is required.");
                return BadRequest("Staff data is required.");
            }

            await _service.UpdateAsync(StaffMapper.ToEntityFromCreating(dto));

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