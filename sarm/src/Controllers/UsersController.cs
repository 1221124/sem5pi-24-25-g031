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
using Microsoft.AspNetCore.Authorization;

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
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
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
                    return BadRequest(new { Message = "Email not found in access token." });
                }

                var user = await _service.GetByEmailAsync(email);

                if (user == null)
                {
                    var assignedRole = await _iamService.AssignRoleToUserAsync(email);
                    if (assignedRole.done)
                    {
                        return Ok(new { exists = false, Message = assignedRole.role });
                    }
                    return BadRequest(new { Message = "Failed to assign role to user." });
                }

                return Ok(new {exists = true});
            }
            catch (Exception ex)
            {
                return BadRequest(new { ex.Message });
            }
        }

        // POST: api/Users
        [HttpPost()]
        [Authorize(Roles = "Admin")]
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
                    staff = await _staffService.AddUserId(dto.Email, user.Id);
                    if (staff == null) {
                        return BadRequest(new { Message = $"Failed to add UserId to Staff with email {dto.Email.Value}." });
                    }
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
                        await _patientService.AdminUpdateAsync(PatientMapper.ToUpdatingPatientDto(patientDto));
                    } else {
                        return BadRequest(new { Message = $"Patient with email {dto.Email.Value} not found." });
                    }
                }
            }

            _ = await _dbLogService.LogAction(EntityType.User, DbLogType.Create, new Message($"User {user.Id} created."));
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }

        // POST: api/Users/login?accessToken={accessToken}
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromQuery] string accessToken)
        {
            try {
                var email = _iamService.GetClaimsFromToken(accessToken).Email;

                var user = await _service.GetByEmailAsync(email);

                if (user == null)
                    return BadRequest(new { message = $"User with email {email} not found." });

                var loggedIn = _service.Login(user);
                if (!loggedIn)
                    return BadRequest(new { message = $"User with email {email} is not active." });

                // Response.Cookies.Append("accessToken", accessToken, new CookieOptions
                // {
                //     HttpOnly = false,
                //     SameSite = SameSiteMode.None,
                //     Secure = true,
                //     Expires = DateTime.UtcNow.AddHours(1)
                // });

                // Console.WriteLine("Cookies in request: " + string.Join(", ", HttpContext.Request.Cookies.Select(c => $"{c.Key}={c.Value}")));

                return Ok( new { message = $"User with email {email} logged in." });
            } catch (BusinessRuleValidationException ex) {
                return BadRequest(new { message = ex.Message });
            }
        }

        // PUT: api/Users/id
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
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
                return Ok(new { message = "Email verified." });
            }

            return NotFound(new { message = "User not found." });
        }

        // Inactivate: api/Users/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
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