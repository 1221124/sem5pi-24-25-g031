using Microsoft.AspNetCore.Mvc;
using Domain.Shared;
using Domain.Users;
using Domain.Staffs;
using Domain.Patients;
using Domain.Emails;
using Infrastructure;
using Domain.IAM;

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

        // GET: api/Users/callback
        [HttpGet("callback")]
        public async Task<ActionResult<UserDto>> HandleCallback([FromQuery] string code)
        {
            if (string.IsNullOrEmpty(code))
            {
                return BadRequest("Authorization code is required.");
            }

            try {
                var idToken = await _iamService.ExchangeCodeForTokenAsync(code);

                var email = await _iamService.GetEmailFromIdTokenAsync(idToken.IdToken);

                if (!email.EndsWith(AppSettings.EmailDomain))
                {
                    return await CreateOrLoginPatientUser(new CreatingUserDto(new Email(email), Role.Patient));
                }
                //TODO: Redirect to Backoffice Login
                return Ok();
            } catch (Exception ex) {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // POST: api/Users/backoffice/create
        [HttpPost("backoffice/create")]
        public async Task<ActionResult<UserDto>> CreateBackofficeUser([FromBody] CreatingUserDto dto)
        {
            var staff = await _staffService.GetByEmailAsync(dto.Email);
            if (staff == null) {
                return BadRequest("Staff profile not found.");
            }

            var user = await _service.GetByEmailAsync(dto.Email);
            if (user != null) {
                return BadRequest(new { Message = $"User with email {dto.Email.Value} already exists." });
            }

            user = await _service.AddAsync(dto);

            staff.UserId = new UserId(user.Id);
            await _staffService.UpdateAsync(StaffMapper.ToEntity(staff));

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }

        // POST: api/Users/patient
        [HttpPost("patient")]
        public async Task<ActionResult<UserDto>> CreateOrLoginPatientUser([FromBody] CreatingUserDto dto)
        {
            // var tokenResponse = await _iamService.ExchangeCodeForTokenAsync(code, "http://localhost:5500/api/patient/register");

            // var email = await _iamService.GetUserInfoFromTokenAsync(tokenResponse.IdToken);

            var patientDto = await _patientService.GetByEmailAsync(dto.Email);

            if (patientDto != null)
            {
                var user = await _service.GetByEmailAsync(dto.Email);

                if (user == null) {
                    user = await _service.AddAsync(dto);

                    patientDto.UserId = new UserId(user.Id);
                    await _patientService.UpdateAsync(patientDto);
                } else {
                    return BadRequest(new { Message = $"User with email {dto.Email.Value} already exists." });
                }
                //TODO: Remove 'else' and Implement Patient Login
                
                return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
            }

            return BadRequest(new { Message = $"Patient with email {dto.Email.Value} not found." });
        }

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