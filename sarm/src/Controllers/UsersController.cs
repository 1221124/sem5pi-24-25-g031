using Microsoft.AspNetCore.Mvc;
using Domain.Shared;
using Domain.Users;
using Domain.Staffs;
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
        private readonly IEmailService _emailService;
        private readonly DbLogService _dbLogService;
        private readonly int pageSize = 2;

        public UsersController(UserService service, StaffService staffService, PatientService patientService, 
        IAMService iAMService, IEmailService emailService, DbLogService dbLogService)
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
                    var assignedRole = await _iamService.AssignRoleToUserAsync(email, accessToken);
                    if (assignedRole.done)
                    {
                        return Ok(new { exists = false, Message = assignedRole.role });
                    }
                    return BadRequest(new { Message = "Failed to assign role to user." });
                }
                if (!_service.Login(user)) return Unauthorized("You are not active. Please contact the system administrator.");

                if (RoleUtils.IsStaff(user.Role)) {
                    if (!await _staffService.IsActive(user.Email) || await _staffService.InvalidUserId(user.Email, user.Id)) {
                        return BadRequest(new { Message = "Staff is not active or does not have its user assigned." });
                    }
                }

                if (RoleUtils.IsPatient(user.Role)) {
                    if (await _patientService.InvalidUserId(user.Email, user.Id)) {
                        return BadRequest(new { Message = "Patient does not have its user assigned." });
                    }
                }

                if (emailAndRole.Roles == null || emailAndRole.Roles.Count == 0 || emailAndRole.Roles[0] == null) {
                    var roleAssigned = await _iamService.AssignRoleToUserAsync(email, accessToken);
                    if (!roleAssigned.done || !string.Equals(roleAssigned.role.Trim().ToLower(), RoleUtils.ToString(user.Role).Trim().ToLower())) {
                        return BadRequest(new { Message = "Failed to assign role to user." });
                    } else {
                        return Ok(new { exists = true, Message = "Login successful! If it's the first time you're logging in our system using a different login method, please login again to be redirected to your profile." });
                    }
                }

                return Ok(new { exists = true, Message = $"User with email {email} logged in successfully!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { ex.Message });
            }
        }

        // POST: api/Users
        [HttpPost()]
        [Authorize()]
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
                        await _patientService.AssignUserId(patientDto, user.Id);
                    } else {
                        return BadRequest(new { Message = $"There is no patient record in our system with email {user.Email.Value}. Please contact our system administrator!" });
                    }
                }
            }

            _ = await _dbLogService.LogAction(EntityType.User, DbLogType.Create, new Message($"User {user.Id} created."));
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
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