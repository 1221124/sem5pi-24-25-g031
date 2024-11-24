using Microsoft.AspNetCore.Mvc;
using Domain.Shared;
using Domain.Staffs;
using Domain.DbLogs;
using Domain.Emails;
using Domain.Patients;
using Microsoft.AspNetCore.Authorization;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private const int pageSize = 2;
        private readonly StaffService _service;

        private readonly IEmailService _emailService;

        private readonly IStaffRepository _repo;

        private readonly DbLogService _dbLogService;

        private static readonly EntityType StaffEntityType = EntityType.Staff;

        private readonly IUnitOfWork _unitOfWork;

        public StaffController(StaffService service, IEmailService iemailService, IStaffRepository repo, IUnitOfWork unitOfWork, DbLogService dbLogService)
        {
            _service = service;
            _emailService = iemailService;
            _repo = repo;
            _dbLogService = dbLogService;
            _unitOfWork = unitOfWork;
        }

        // GET: api/Staff/?pageNumber=1
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<StaffDto>>> Get([FromQuery] string? pageNumber,[FromQuery] string? name, [FromQuery] string? email, [FromQuery] string? specialization)
        {
            var staff = await _service.GetAsync(name, email, specialization);

            if (staff == null)
            {
                return NotFound();
            }

            var totalItems = staff.Count;
            
            if (pageNumber != null && int.TryParse(pageNumber, out int page))
            {
                var paginatedStaffs = staff
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
                staff = paginatedStaffs;
            }

            return Ok(new { staff = staff, totalItems = totalItems });
        }

        //GET: api/Staff/5
        [HttpGet("{id}")]
        [Authorize]
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
        [Authorize]
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
        [Authorize]
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
        [Authorize]
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

        //GET: api/Staff/search/role?role=Doctor/?pageNumber=1
        [HttpGet("search/role")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetByRoleAsync([FromQuery] String role, int pageNumber)
        {
            var staffList = await _service.SearchByRoleAsync(StaffRoleUtils.FromString(role));

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

        //GET: api/Staff/licenseNumber?role=role
        [HttpGet("licenseNumber")]
        [Authorize]
        public async Task<ActionResult<LicenseNumber>> AssignLicenseNumberAsync([FromQuery] string role)
        {
            var staffRole = StaffRoleUtils.FromString(role);

            var licenseNumber = await _service.AssignLicenseNumberAsync(staffRole);

            if (licenseNumber == null)
            {
                return BadRequest(new {message = "License number could not be assigned."});
            }

            return Ok(new {message = licenseNumber.Value});
        }

        //GET: api/Staff/userIdNull
        [HttpGet("userIdNull")]
        [Authorize (Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetActiveByUserIdNull([FromQuery] string? pageNumber)
        {
            var staff = await _service.GetActiveWithUserIdNull();

            if (staff == null)
            {
                return NotFound();
            }

            var totalItems = staff.Count;
            
            if (pageNumber != null && int.TryParse(pageNumber, out int page))
            {
                var paginatedStaffs = staff
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
                staff = paginatedStaffs;
            }

            return Ok(new { staff = staff, totalItems = totalItems });
        }

        // POST: api/Staff
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<StaffDto>> Create([FromBody] CreatingStaffDto staffDto)
        //public IActionResult Create([FromBody] CreatingStaffDto staffDto)
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
                return BadRequest("Creating Staff Error: " + ex.Message);
            }

            // Console.WriteLine("Creating Staff");
            // Console.WriteLine(staffDto);
            // return Ok();
        }

        // PUT: api/Staff/5
        [HttpPut("updateSlotAvailability/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<StaffDto>> UpdateSlotAvailability(Guid id, [FromBody] Slot slot)
        {
            try
            {
                var staff = await _service.GetByIdAsync(new StaffId(id));

                if (staff == null)
                {
                    return NotFound("Staff not found");
                }

                var updateStaff = await _service.AddSlotAvailability(staff, slot);
                if (updateStaff == null)
                {
                    return BadRequest("Staff slot availability could not be updated.");
                }

                return Ok(updateStaff);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // PUT: api/Staff/5
        [HttpPut("updateSlotAppointment/{id}")]
        [Authorize (Roles = "Admin")]
        public async Task<ActionResult<StaffDto>> UpdateSlotAppointment(Guid id, [FromBody] Slot slot)
        {
            try
            {
                var staff = await _service.GetByIdAsync(new StaffId(id));

                if (staff == null)
                {
                    return NotFound("Staff not found");
                }

                var updateStaff = await _service.AddSlotAppointment(staff, slot);
                if (updateStaff == null)
                {
                    return BadRequest("Staff slot availability could not be updated.");
                }

                return Ok(updateStaff);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // PUT: api/Staff/5
        [HttpPut("update/{oldEmail}")]
        [Authorize (Roles = "Admin")]
        public async Task<ActionResult<StaffDto>> Update(string oldEmail, [FromBody] UpdatingStaffDto dto)
        {
            try
            {
                if (dto == null)
                {
                    _dbLogService.LogAction(EntityType.Staff, DbLogType.Update, "Staff data is required.");
                    return BadRequest("Invalid UpdatingStaffDto");
                }

                var staff = await _service.GetByEmailAsync(oldEmail);

                if (staff == null)
                {
                    return NotFound("Staff not found");
                }

                var updateStaff = await _service.UpdateAsync(oldEmail, dto);

                if (dto.PhoneNumber == null && dto.Email == null) return Ok(new { updateStaff = updateStaff });

                var (subject, body) = await _emailService.GenerateVerificationEmailContentSensitiveInfoStaff(oldEmail, dto);
                await _emailService.SendEmailAsync(oldEmail, subject, body);

                return Ok(new { updateStaff = updateStaff });
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(ex.Message);
            }

        }

        //GET: api/Staff/sensitiveInfo/?email={email}&token={token}&pendingPhoneNumber={phoneNumber}&pendingEmail={newEmail}
        [HttpGet("sensitiveInfo")]
        public async Task<ActionResult<StaffDto?>> VerifySensitiveInfo([FromQuery] string token, [FromQuery] string? pendingPhoneNumber, [FromQuery] string? pendingEmail)
        {
            Console.WriteLine(pendingPhoneNumber);
            Console.WriteLine(pendingEmail);

            var emailDecode = _emailService.DecodeToken(token); //1220786

            var staffDto = await _service.GetByEmailAsync(new Email(emailDecode)); //1220784

            if (staffDto == null)
                return null;

            var staff = StaffMapper.ToEntity(staffDto);

            if (!string.IsNullOrEmpty(pendingPhoneNumber))
            {
                staff.ContactInformation.PhoneNumber = new PhoneNumber(pendingPhoneNumber);
            }
            if (!string.IsNullOrEmpty(pendingEmail))
            {
                staff.ContactInformation.Email = pendingEmail;
            }

            await _unitOfWork.CommitAsync();

            return StaffMapper.ToDto(staff);
        }


        [HttpDelete("{id}")]
        [Authorize (Roles = "Admin")]
        public async Task<ActionResult<StaffId>> SoftDelete(Guid id)
        {
            try
            {
                var result = await _service.InactivateAsync(new StaffId(id));

                if (result == null)
                {
                    return NotFound("Staff could not be inactivated.");
                }

                await _dbLogService.LogAction(EntityType.Staff, DbLogType.Deactivate, "Staff deactivated");
                return Ok();
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