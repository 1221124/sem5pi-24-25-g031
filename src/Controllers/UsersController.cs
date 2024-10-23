using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using Domain.Shared;
using Domain.Users;
using Domain.IAM;
using Domain.Staffs;
using Domain.Patients;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _service;
        private readonly StaffService _staffService;
        private readonly PatientService _patientService;
        private readonly IAMService _iamService;

        public UsersController(UserService service, StaffService staffService, PatientService patientService, IAMService iAMService)
        {
            _service = service;
            _staffService = staffService;
            _patientService = patientService;
            _iamService = iAMService;
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetById(Guid id)
        {
            var User = await _service.GetByIdAsync(new UserId(id));

            if (User == null)
            {
                return NotFound();
            }

            return User;
        }

        // POST: api/User
        [HttpPost]
        public async Task<ActionResult<UserDto>> Create(CreatingUserDto dto)
        {
            var User = await _service.AddAsync(dto);

            var StaffDto = await _staffService.GetByEmailAsync(dto.Email);

            if (StaffDto == null)
            {
                var PatientDto = await _patientService.GetByEmailAsync(new Email(dto.Email));

                if (PatientDto == null)
                {
                    return BadRequest(new { Message = "User's profile not found" });
                }

                PatientDto.UserId = new UserId(User.Id);

                var Patient = await _patientService.UpdateAsync(PatientDto);
            }
            else
            {
                StaffDto.UserId = new UserId(User.Id);

                // var Staff = await _staffService.UpdateAsync(StaffDto);
            }

            return CreatedAtAction(nameof(GetById), new { id = User.Id }, User);
        }


        // PUT: api/User/5
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Update(UserDto dto)
        {

            try
            {
                var User = await _service.UpdateAsync(dto);

                if (User == null)
                {
                    return NotFound();
                }
                return Ok(User);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { ex.Message });
            }
        }

        // Inactivate: api/User/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserDto>> SoftDelete(Guid id)
        {
            var User = await _service.InactivateAsync(new UserId(id));

            if (User == null)
            {
                return NotFound();
            }

            return Ok(User);
        }

        // DELETE: api/User/5
        [HttpDelete("{id}/hard")]
        public async Task<ActionResult<UserDto>> HardDelete(Guid id)
        {
            try
            {
                var User = await _service.DeleteAsync(new UserId(id));

                if (User == null)
                {
                    return NotFound();
                }

                return Ok(User);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}