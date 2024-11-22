using Microsoft.AspNetCore.Mvc;
using Domain.Shared;

namespace DDDNetCore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnumsController : ControllerBase
    {
        private readonly EnumsService _enumsService;

        public EnumsController(EnumsService enumsService)
        {
            _enumsService = enumsService;
        }

        [HttpGet("roles")]
        public Task<ActionResult<List<string>>> GetRoles()
        {
            var roles = _enumsService.GetRoles();
            return Task.FromResult<ActionResult<List<string>>>(Ok(roles));
        }

        [HttpGet("statuses")]
        public Task<ActionResult<List<string>>> GetStatuses()
        {
            var statuses = _enumsService.GetStatuses();
            return Task.FromResult<ActionResult<List<string>>>(Ok(statuses));
        }

        [HttpGet("requestStatuses")]
        public ActionResult<List<string>> GetRequestStatuses()
        {
            var requestStatuses = _enumsService.GetRequestStatuses();
            
            if(requestStatuses == null || requestStatuses.Count == 0) return NotFound();

            return Ok(requestStatuses);
        }

        [HttpGet("priorities")]
        public ActionResult<List<string>> GetPriorities()
        {
            var priorities = _enumsService.GetRPriorities();

            if (priorities == null || priorities.Count == 0) return NotFound();
            
            return Ok(priorities);
        }

        [HttpGet("genders")]
        public Task<ActionResult<List<string>>> GetGenders()
        {
            var genders = _enumsService.GetGenders();
            return Task.FromResult<ActionResult<List<string>>>(Ok(genders));
        }

        [HttpGet("specializations")]
        public Task<ActionResult<List<string>>> GetSpecializations()
        {
            var specializations = _enumsService.GetSpecializations();
            return Task.FromResult<ActionResult<List<string>>>(Ok(specializations));
        }

        [HttpGet("backofficeRoles")]
        public Task<ActionResult<List<string>>> GetBackofficeRoles()
        {
            var backofficeRoles = _enumsService.GetBackofficeRoles();
            return Task.FromResult<ActionResult<List<string>>>(Ok(backofficeRoles));
        }

        [HttpGet("staffRoles")]
        public Task<ActionResult<List<string>>> GetStaffRoles()
        {
            var staffRoles = _enumsService.GetStaffRoles();
            return Task.FromResult<ActionResult<List<string>>>(Ok(staffRoles));
        }

        [HttpGet("userStatuses")]
        public Task<ActionResult<List<string>>> GetUserStatuses()
        {
            var userStatuses = _enumsService.GetUserStatuses();
            return Task.FromResult<ActionResult<List<string>>>(Ok(userStatuses));
        }

        [HttpGet("dbLogTypes")]
        public Task<ActionResult<List<string>>> GetDBLogTypes()
        {
            var dbLogTypes = _enumsService.GetDBLogTypes();
            return Task.FromResult<ActionResult<List<string>>>(Ok(dbLogTypes));
        }

        [HttpGet("entityTypes")]
        public Task<ActionResult<List<string>>> GetEntityTypes()
        {
            var entityTypes = _enumsService.GetEntityTypes();
            return Task.FromResult<ActionResult<List<string>>>(Ok(entityTypes));
        }

        [HttpGet("updateTypes")]
        public Task<ActionResult<List<string>>> GetUpdateTypes()
        {
            var updateTypes = _enumsService.GetUpdateTypes();
            return Task.FromResult<ActionResult<List<string>>>(Ok(updateTypes));
        }
        
        [HttpGet("surgeryRooms")]
        public Task<ActionResult<List<string>>> GetSurgeryRooms()
        {
            var surgeryRooms = _enumsService.GetSurgeryRooms();
            return Task.FromResult<ActionResult<List<string>>>(Ok(surgeryRooms));
        }
    }
}