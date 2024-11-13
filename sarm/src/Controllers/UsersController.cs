using Microsoft.AspNetCore.Mvc;
using Domain.Shared;
using Domain.Users;
using Domain.Staffs;
using Domain.Patients;
using Domain.Emails;
using Domain.IAM;
using DDDNetCore.Domain.Patients;
using Domain.DbLogs;
using DDDNetCore.Domain.DbLogs;

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
        private readonly DbLogService _dbLogService;
        private readonly int pageSize = 2;

        public UsersController(UserService service, StaffService staffService, PatientService patientService, 
        IAMService iAMService, EmailService emailService, DbLogService dbLogService)
        {
            _service = service;
            _staffService = staffService;
            _patientService = patientService;
            _iamService = iAMService;
            _emailService = emailService;
            _dbLogService = dbLogService;
        }

        // GET: api/Users?pageNumber={pageNumber}
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAll([FromQuery] string? pageNumber)
        {
            var users = await _service.GetAllAsync();
            
            if (users == null)
            {
                return NotFound();
            }

            if (pageNumber != null)
            {
                var paginatedUsers = users
                    .Skip((int.Parse(pageNumber)) * pageSize)
                    .Take(pageSize)
                    .ToList();
                return paginatedUsers;
            }

            return Ok(users);
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

        // POST: api/Users/callback
        [HttpPost("callback")]
        public async Task<ActionResult<bool>> HandleCallback([FromBody] TokenResponse body)
        {
            var accessToken = body.AccessToken;
            
            if (string.IsNullOrEmpty(accessToken))
            {
                return BadRequest( new { Message = "AccessToken is missing." });
            }

            try
            {
                var emailAndRole = _iamService.GetClaimsFromToken(accessToken);
                
                Email email = new Email(emailAndRole.Email);
                if (email == null)
                {
                    return BadRequest(new { Message = "Email not found access token." });
                }

                var user = await _service.GetByEmailAsync(email);

                if (user == null)
                {
                    return BadRequest(new { Message = $"User with email {email.Value} not found." });
                }

                return Ok(new { user.Id, user.Email, user.Role });
            }
            catch (Exception ex)
            {
                return BadRequest(new { ex.Message });
            }
        }

        // POST: api/Users
        [HttpPost()]
        public async Task<ActionResult<UserDto>> Create(CreatingUserDto dto)
        {
            var user = await _service.GetByEmailAsync(dto.Email);
            if (user != null) {
                return BadRequest(new { Message = $"User with email {dto.Email.Value} already exists." });
            }

            user = await _service.AddAsync(dto);

            if (RoleUtils.IsStaff(dto.Role))
            {
                var staff = await _staffService.GetByEmailAsync(dto.Email);
                if (staff != null) {
                    staff.UserId = new UserId(user.Id);
                    await _staffService.UpdateAsync(dto.Email, StaffMapper.ToEntityFromUpdating(staff));
                }

                (string subject, string body) = await _emailService.GenerateVerificationEmailContent(dto.Email);
                await _emailService.SendEmailAsync(dto.Email.Value, subject, body);
            }
            else
            {
                user.UserStatus = UserStatus.Active;
                await _service.UpdateAsync(user);
                
                if (RoleUtils.IsPatient(dto.Role))
                {
                    var patientDto = await _patientService.GetByEmailAsync(dto.Email);
                    if (patientDto != null)
                    {
                        patientDto.UserId = new UserId(user.Id);
                        await _patientService.UpdateAsync(PatientMapper.ToUpdatingPatientDto(patientDto));
                    }
                }
            }

            _ = await _dbLogService.LogAction(EntityType.User, DbLogType.Create, new Message($"User {user.Id} created."));
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }

        // POST: api/Users/login?idToken={idToken}
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromQuery] string accessToken)
        {
            try {
                var email = _iamService.GetClaimsFromToken(accessToken).Email;

                var user = await _service.GetByEmailAsync(email);

                if (user == null)
                    return BadRequest(new { Message = $"User with email {email} not found." });

                user = _service.Login(user);

                return Ok(user.Email.Value.Split('@')[0]);
            } catch (BusinessRuleValidationException ex) {
                return BadRequest(new { ex.Message });
            }
        }

        // PUT: api/Users/id
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Update(Guid id, UserDto dto)
        {
            try
            {
                if (id != dto.Id)
                {
                    return BadRequest();
                }

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

        // GET: api/Users/verify
        [HttpGet("verify")]
        public async Task<ActionResult<UserDto>> VerifyEmail([FromQuery] string token)
        {
            var email = _emailService.DecodeToken(token);
            
            var user = await _service.GetByEmailAsync(new Email(email));

            if (user != null)
            {
                user.UserStatus = UserStatus.Active;
                await _service.UpdateAsync(user);
                return Ok(new { Message = "Email verified." });
            }

            return NotFound();
        }

        // Inactivate: api/Users/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserDto>> SoftDelete(Guid id)
        {
            try {
                var User = await _service.InactivateAsync(new UserId(id));

                if (User == null)
                {
                    return NotFound();
                }

                return Ok(new { Message = "User inactivated." });
            } catch (BusinessRuleValidationException ex) {
                return BadRequest(new { ex.Message });
            }
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

                return Ok(new {User.Id, User.Email, User.Role});
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { ex.Message });
            }
        }
    }
}