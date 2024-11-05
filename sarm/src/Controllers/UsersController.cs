using Microsoft.AspNetCore.Mvc;
using Domain.Shared;
using Domain.Users;
using Domain.Staffs;
using Domain.Patients;
using Domain.Emails;
using Domain.IAM;
using Domain.UsersSession;
using DDDNetCore.Domain.Patients;
using Domain.DbLogs;
using DDDNetCore.Domain.DbLogs;
using Microsoft.Extensions.Caching.Memory;

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
        private readonly SessionService _sessionService;
        private readonly DbLogService _dbLogService;
        private readonly IMemoryCache _memoryCache;
        private readonly int pageSize = 2;

        public UsersController(UserService service, StaffService staffService, PatientService patientService, 
        IAMService iAMService, EmailService emailService, SessionService sessionService, DbLogService dbLogService, IMemoryCache memoryCache)
        {
            _service = service;
            _staffService = staffService;
            _patientService = patientService;
            _iamService = iAMService;
            _emailService = emailService;
            _sessionService = sessionService;
            _dbLogService = dbLogService;
            _memoryCache = memoryCache;
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

        // GET: api/Users/callback
        [HttpGet("callback")]
        public async Task<ActionResult<UserDto>> HandleCallback([FromQuery] string code)
        {
            if (string.IsNullOrEmpty(code))
            {
                return BadRequest("Authorization code is required.");
            }

            try {
                var tokenResponse = await _iamService.ExchangeCodeForTokenAsync(code);

                var idToken = tokenResponse.IdToken;
                Console.WriteLine("IdToken: " + idToken);
                var accessToken = tokenResponse.AccessToken;
                Console.WriteLine("AccessToken: " + accessToken);

                var emailAndRole = _iamService.GetClaimsFromToken(accessToken);

                Email email = new Email(emailAndRole.Email);
                Console.WriteLine("Callback email: " + email.Value);
                if (email == null)
                {
                    return BadRequest("Email not found in access token.");
                }
                List<string> roles = emailAndRole.Roles;
                if (roles.Count == 0)
                {
                    return BadRequest("Roles not found in access token.");
                }
                Role role = RoleUtils.FromString(roles[0]);
                Console.WriteLine("Callback role: " + RoleUtils.ToString(role));

                var user = await _service.GetByEmailAsync(email);
                var dto = new CreatingUserDto(new Email(email), role);

                if (user != null)
                {
                    return await Login(dto, idToken, accessToken);
                }

                return await Create(dto, idToken, accessToken);

                // if (email.Trim().ToLower().Equals(AppSettings.AdminEmail.Trim().ToLower()))
                // {
                //     return await CreateAdminUser(new CreatingUserDto(new Email(email), Role.Admin));
                // }
                // else if(email.Trim().ToLower().EndsWith(AppSettings.EmailDomain.Trim().ToLower()))
                // {
                //     return Ok("Registration in IAM sucessful. Please, wait for the administrator to create your account in our system.");
                // } else {
                //     return await CreatePatientUser(new CreatingUserDto(new Email(email), Role.Patient));
                // }

            } catch (Exception ex) {
                return BadRequest(new { ex.Message });
            }
        }

        // POST: api/Users/register
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Create(CreatingUserDto dto, string idToken, string accessToken)
        {
            var user = await _service.GetByEmailAsync(dto.Email);
            if (user != null) {
                return BadRequest(new { Message = $"User with email {dto.Email.Value} already exists." });
            }

            if (RoleUtils.IsStaff(dto.Role))
            {
                return await CreateStaffUser(dto);
            }
            else
            {
                user = await _service.AddAsync(dto);
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

            _dbLogService.LogAction(EntityType.User, DbLogType.Create, new Message($"User {user.Id} created."));
            return await Login(dto, idToken, accessToken);
        }

        // POST: api/Users/login
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(CreatingUserDto dto, string idToken, string accessToken)
        {
            Email email = dto.Email;
            Role role = dto.Role;

            var user = await _service.GetByEmailAsync(email);

            if (user == null)
                return BadRequest(new { Message = $"User with email {email.Value} not found." });

            if (idToken == null || accessToken == null)
                return BadRequest(new { Message = "ID token and access token are required." });

            // var cookieOptions = new CookieOptions
            // {
            //     HttpOnly = true,
            //     Expires = DateTimeOffset.UtcNow.AddMinutes(60)
            // };
            // Response.Cookies.Append("accessToken", accessToken, cookieOptions);

             _memoryCache.Set("accessToken", accessToken, TimeSpan.FromMinutes(60));

            // var userSession = new UserSession(
            //     new UserId(user.Id),
            //     user.Email,
            //     user.Role,
            //     idToken,
            //     accessToken
            // );

            // await _sessionService.CreateSessionAsync(userSession);

            return Ok(user);
        }

        // POST: api/Users/staff
        [HttpPost("staff")]
        public async Task<ActionResult<UserDto>> CreateStaffUser(CreatingUserDto dto)
        {
            var user = await _service.GetByEmailAsync(dto.Email);
            if (user != null) {
                return BadRequest(new { Message = $"User with email {dto.Email.Value} already exists." });
            }

            if (!RoleUtils.IsStaff(dto.Role))
            {
                return BadRequest(new { Message = $"Role {dto.Role} is not a staff role." });
            }

            user = await _service.AddAsync(dto);

            var staff = await _staffService.GetByEmailAsync(dto.Email);
            if (staff != null) {
                staff.UserId = new UserId(user.Id);
                await _staffService.UpdateAsync(dto.Email, StaffMapper.ToEntityFromUpdating(staff));
            }

            (string subject, string body) = await _emailService.GenerateVerificationEmailContent(dto.Email);
            await _emailService.SendEmailAsync(dto.Email.Value, subject, body);

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }

        // PUT: api/Users
        [HttpPut()]
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
                return Ok(user);
            }

            return NotFound("User not found.");
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