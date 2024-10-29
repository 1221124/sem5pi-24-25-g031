using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Linq.Expressions;
using Domain.Shared;
using Domain.Staffs;
using Infrastructure;
using System.Threading.Tasks;
using Domain.DBLogs;
using Domain.Patients;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly int pageSize = 2;
        private readonly StaffService _service;

        private readonly IStaffRepository _repo;

        //private readonly DbLogService _DBLogService;

        private static readonly EntityType StaffEntityType = EntityType.Staff;

        public StaffController(StaffService service)
        {
            _service = service;
        }

        // GET: api/Staff/?pageNumber=1
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetAll(int pageNumber)
        {
            var staff = await _service.GetAllAsync();
            
            var paginatedStaff = staff
                .Skip((pageNumber - 1) * pageSize) 
                .Take(pageSize)                    
                .ToList();                         
            
            return paginatedStaff;
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

        //GET: api/Staff/search/name?name=Beatriz-Silva/?pageNumber=1
        [HttpGet("search/name")]
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetBySearchCriteriaName([FromQuery] String fullName, int pageNumber)
        {
            var names = fullName.Split('-');
            
            if (names.Length != 2)
            {
                return BadRequest("Full name format is invalid. Expected format: FirstName%2LastName");
            }
            
            var firstName = names[0];
            var lastName = names[1];
            
            var staffList = await _service.SearchByNameAsync(new FullName(new Name(firstName), new Name(lastName))); 

            if (staffList == null)
            {
                return NotFound();
            }
            
            var paginatedStaff = staffList
                .Skip((pageNumber - 1) * pageSize) 
                .Take(pageSize)                    
                .ToList();                         
            
            return paginatedStaff;
        }
        
        
        [HttpGet("search/{email}")]
        public async Task<ActionResult<StaffDto>> GetBySearchCriteriaEmail(String email)
        {
            var staffList = await _service.SearchByEmailAsync(new Email(email)); 

            if (staffList == null)
            {
                return NotFound();
            }
            return Ok(staffList);
        }
        
        //GET: api/Staff/search/specialization?specialization=CARDIOLOGY/?pageNumber=1
        [HttpGet("search/specialization")] 
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetBySpecializationAsync([FromQuery] String specialization, int pageNumber)
        {
            var staffList = await _service.SearchBySpecializationAsync(SpecializationUtils.FromString(specialization)); 

            if (staffList == null)
            {
                return NotFound();
            }
            
            var paginatedStaff = staffList
                .Skip((pageNumber - 1) * pageSize) 
                .Take(pageSize)                    
                .ToList();                         
            
            return paginatedStaff;
        }

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

                var staff = await _service.AddAsync(StaffMapper.ToEntityFromCreating(staffDto), staffDto.RoleFirstChar);

                return CreatedAtAction(nameof(GetById), new { id = staff.Id }, staff);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }

        }

        // PUT: api/Staff/5
        [HttpPut("update/{oldEmail}")]
        public async Task<ActionResult<StaffDto>> Update(string oldEmail, [FromBody] UpdatingStaffDto dto)
        {
            if (dto == null)
            {
                //_DBLogService.LogError(EntityType.STAFF, "Staff data is required.");
                return BadRequest("Staff data is required.");
            }
            var staff = await _service.GetByEmailAsync(oldEmail); 
            
            await _service.UpdateAsync(oldEmail, StaffMapper.ToEntityFromUpdating(dto, staff));

            return Ok("Staff profile updated successfully.");
        }

        [HttpDelete("{email}")]
        public async Task<ActionResult<StaffId>> SoftDelete(String email)
        {
            try
            {
                if (email == null)
                    return BadRequest("Invalid request data.");
                
                var staff = await _service.GetByEmailAsync(email);

                if (staff == null)
                {
                    return NotFound("Staff not found.");
                }

                var result = await _service.InactivateAsync(email);

                if (result == null)
                {
                    return NotFound("Staff could not be inactivated.");
                }
                
                return Ok("Deactivate staff profile successfully.");
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        /*// DELETE: api/Staff/5
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
        }*/
    }
}