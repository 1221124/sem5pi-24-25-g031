using Microsoft.AspNetCore.Mvc;
using Domain.Shared;
using Domain.Users;
using Domain.IAM;
using Domain.Staffs;
using Domain.Patients;
using Domain.Emails;

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
        private readonly EmailService _emailService;

        public UsersController(UserService service, StaffService staffService, PatientService patientService, IAMService iAMService, EmailService emailService)
        {
            _service = service;
            _staffService = staffService;
            _patientService = patientService;
            _iamService = iAMService;
            _emailService = emailService;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/Users/5
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

        // POST: api/Users/register/backoffice
        [HttpPost("register/backoffice")]
        public async Task<ActionResult<UserDto>> RegisterBackoffice([FromBody] string token)
        {
            var email = await _iamService.GetUserInfoFromTokenAsync(token);

            Role role;
            if (email.Value.EndsWith("@myhospital.com"))
            {
                var firstChar = email.Value[0].ToString().ToUpper();
                role = RoleUtils.FromFirstChar(firstChar);

            }
            else
            {
                return BadRequest(new { Message = "Invalid email domain for backoffice registration." });
            }

            var staff = await _staffService.GetByEmailAsync(email);
            if (staff == null) {
                return BadRequest("Staff profile not found.");
            } else {
                var user = await _service.AddAsync(new CreatingUserDto(email, role));
                staff.UserId = new UserId(user.Id);
                var staffDto = await _staffService.UpdateAsync(StaffMapper.ToEntity(staff));
            }

            return CreatedAtAction(nameof(GetById), new { id = staff.Id }, staff);
        }

        // POST: api/Users/register/patient
        [HttpPost("register/patient")]
        public async Task<ActionResult<UserDto>> RegisterPatientUser(CreatingUserDto dto)
        {
            var PatientDto = await _patientService.GetByEmailAsync(new Email(dto.Email));

            if (PatientDto != null)
            {
                var User = await _service.AddAsync(dto);

                PatientDto.UserId = new UserId(User.Id);
                await _patientService.UpdateAsync(PatientDto);
                
                return CreatedAtAction(nameof(GetById), new { id = User.Id }, User);
            }

            return BadRequest(new { Message = "Patient profile not found. If you are sure you have a patient record in our hospital, please provide a mobile number for linking." });
        }

        // // POST: api/Users
        // [HttpPost]
        // public async Task<ActionResult<UserDto>> Create(CreatingUserDto dto)
        // {
        //     var User = await _service.AddAsync(dto);

        //     var StaffDto = await _staffService.GetByEmailAsync(dto.Email);

        //     if (StaffDto == null)
        //     {
        //         var PatientDto = await _patientService.GetByEmailAsync(new Email(dto.Email));

        //         if (PatientDto == null)
        //         {
        //             return BadRequest(new { Message = "User's profile not found" });
        //         }

        //         await _emailService.SendEmailAsync(PatientDto.ContactInformation.Email.Value, "Registration Confirmation", "Please, confirm your registration.");

        //         PatientDto.UserId = new UserId(User.Id);

        //         var Patient = await _patientService.UpdateAsync(PatientDto);
        //     }
        //     else
        //     {
        //         StaffDto.UserId = new UserId(User.Id);

        //         var Staff = await _staffService.UpdateAsync(StaffMapper.ToEntity(StaffDto));
        //     }

        //     return CreatedAtAction(nameof(GetById), new { id = User.Id }, User);
        // }

        // PUT: api/Users/5
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

        // Inactivate: api/Users/5
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

        // DELETE: api/Users/5
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