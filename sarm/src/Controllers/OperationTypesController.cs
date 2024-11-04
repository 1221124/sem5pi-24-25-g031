using Microsoft.AspNetCore.Mvc;
using Domain.Shared;
using Domain.OperationTypes;
using Domain.UsersSession;
using Domain.Authz;
using Microsoft.AspNetCore.Authorization;
using Domain.DbLogs;
using DDDNetCore.Domain.DbLogs;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationTypesController : ControllerBase
    {
        private readonly int pageSize = 2;
        private readonly OperationTypeService _service;
        private readonly SessionService _sessionService;
        private readonly DbLogService _dbLogService;

        public OperationTypesController(OperationTypeService service, SessionService sessionService, DbLogService dbLogService)
        {
            _service = service;
            _sessionService = sessionService;
            _dbLogService = dbLogService;
        }

        // GET: api/OperationTypes?pageNumber={pageNumber}
        [HttpGet]
        [Authorize(Roles = "Admin")]
        // [RequiredRole("Admin")]
        public async Task<ActionResult<IEnumerable<OperationTypeDto>>> GetAll([FromQuery] string? pageNumber)
        {
            // var idToken = HttpContext.Session.GetString("idToken");
            // if (string.IsNullOrEmpty(idToken))
            // {
            //     return Unauthorized("No idToken found in session");
            // }

            // var authorizeAttributes = (AuthorizeAttribute[])this.GetType()
            //     .GetMethod(nameof(GetAll))
            //     .GetCustomAttributes(typeof(AuthorizeAttribute), true);

            // var requiredRole = (RequiredRoleAttribute)Attribute.GetCustomAttribute(
            //     GetType().GetMethod(nameof(GetAll)), typeof(RequiredRoleAttribute));

            // bool isAuthorized = _authorizationService.IsAuthorized(idToken, requiredRole.Role);
            // if (!isAuthorized)
            // {
            //     return Unauthorized("User is not authorized");
            // }

            var operationTypes = await _service.GetAllAsync();
            
            if (operationTypes == null)
            {
                return NotFound();
            }

            if (pageNumber != null)
            {
                var paginatedOperationTypes = operationTypes
                    .Skip((int.Parse(pageNumber)) * pageSize)
                    .Take(pageSize)
                    .ToList();
                return paginatedOperationTypes;
            }

            return Ok(operationTypes);
        }

        // GET: api/OperationTypes/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<OperationTypeDto>> GetById(Guid id)
        {
            var operationType = await _service.GetByIdAsync(new OperationTypeId(id));

            if (operationType == null)
            {
                return NotFound();
            }

            return operationType;
        }

        // GET: api/OperationTypes/name/{name}
        [HttpGet("name/{name}")]
        public async Task<ActionResult<OperationTypeDto>> GetByName(string name)
        {
            var operationType = await _service.GetByNameAsync(name);

            if (operationType == null)
            {
                return NotFound();
            }

            return operationType;
        }

        // GET: api/OperationTypes/specialization/{specialization}?pageNumber={pageNumber}
        [HttpGet("specialization/{specialization}")]
        public async Task<ActionResult<List<OperationTypeDto>>> GetBySpecialization(Specialization specialization, [FromQuery] string? pageNumber)
        {
            var operationTypes = await _service.GetBySpecializationAsync(specialization);

            if (operationTypes == null)
            {
                return NotFound();
            }

            if (pageNumber != null)
            {
                var paginatedOperationTypes = operationTypes
                    .Skip((int.Parse(pageNumber)) * pageSize)
                    .Take(pageSize)
                    .ToList();
                return paginatedOperationTypes;
            }

            return operationTypes;
        }

        // GET: api/OperationTypes/status/{status}?pageNumber={pageNumber}
        [HttpGet("status/{status}")]
        public async Task<ActionResult<List<OperationTypeDto>>> GetByStatus(Status status, [FromQuery] string? pageNumber)
        {
            var operationTypes = await _service.GetByStatusAsync(status);

            if (operationTypes == null)
            {
                return NotFound();
            }

            if (pageNumber != null)
            {
                var paginatedOperationTypes = operationTypes
                    .Skip((int.Parse(pageNumber)) * pageSize)
                    .Take(pageSize)
                    .ToList();
                return paginatedOperationTypes;
            }

            return operationTypes;
        }

        // POST: api/OperationTypes
        [HttpPost]
        public async Task<ActionResult<OperationTypeDto>> Create([FromBody] CreatingOperationTypeDto dto)
        {
            if (dto == null)
            {
                _dbLogService.LogAction(EntityType.OperationType, DbLogType.Error, new Message("Error creating operation type: DTO is null"));
                return BadRequest("Creating Operation Type DTO cannot be null");
            }

            var operationType = await _service.GetByNameAsync(dto.Name);
            if (operationType != null)
            {
                _dbLogService.LogAction(EntityType.OperationType, DbLogType.Error, new Message("Error creating operation type: name already exists"));
                return BadRequest("Operation Type with this name already exists");
            }

            operationType = await _service.AddAsync(dto);

            _dbLogService.LogAction(EntityType.OperationType, DbLogType.Create, new Message($"Create {operationType.Id}"));
            return CreatedAtAction(nameof(GetById), new { id = operationType.Id }, operationType);
        }

        
        // PUT: api/OperationTypes
        [HttpPut()]
        public async Task<ActionResult<OperationTypeDto>> Update(OperationTypeDto dto)
        {
            try
            {
                var operationType = await _service.UpdateAsync(dto);
                
                if (operationType == null)
                {
                    _dbLogService.LogAction(EntityType.OperationType, DbLogType.Error, new Message("Error updating operation type: operation type not found"));
                    return NotFound();
                }
                _dbLogService.LogAction(EntityType.OperationType, DbLogType.Update, new Message($"Update {operationType.Id}"));
                return Ok(operationType);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new { ex.Message});
            }
        }

        // Inactivate: api/OperationTypes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<OperationTypeDto>> SoftDelete(Guid id)
        {
            var operationType = await _service.InactivateAsync(new OperationTypeId(id));

            if (operationType == null)
            {
                _dbLogService.LogAction(EntityType.OperationType, DbLogType.Error, new Message("Error inactivating operation type: operation type not found"));
                return NotFound();
            }

            _dbLogService.LogAction(EntityType.OperationType, DbLogType.Deactivate, new Message($"Deactivate {operationType.Id}"));
            return Ok(operationType);
        }
        
        // DELETE: api/OperationTypes/5
        [HttpDelete("{id}/hard")]
        public async Task<ActionResult<OperationTypeDto>> HardDelete(Guid id)
        {
            try
            {
                var operationType = await _service.DeleteAsync(new OperationTypeId(id));

                if (operationType == null)
                {
                    _dbLogService.LogAction(EntityType.OperationType, DbLogType.Error, new Message("Error deleting operation type: operation type not found"));
                    return NotFound();
                }

                _dbLogService.LogAction(EntityType.OperationType, DbLogType.Delete, new Message($"Delete {operationType.Id}"));
                return Ok(operationType);
            }
            catch(BusinessRuleValidationException ex)
            {
               return BadRequest(new {ex.Message});
            }
        }
    }
}