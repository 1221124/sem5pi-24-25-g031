using Microsoft.AspNetCore.Mvc;
using Domain.Shared;
using Domain.OperationTypes;
using Domain.DbLogs;
using DDDNetCore.Domain.DbLogs;
using Microsoft.AspNetCore.Authorization;
using DDDNetCore.Domain.OperationRequests;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationTypesController : ControllerBase
    {
        private readonly int pageSize = 2;
        private readonly OperationTypeService _service;
        private readonly DbLogService _dbLogService;
        private readonly OperationRequestService _operationRequestService;

        public OperationTypesController(OperationTypeService service, DbLogService dbLogService, OperationRequestService operationRequestService)
        {
            _service = service;
            _dbLogService = dbLogService;
            _operationRequestService = operationRequestService;
        }

        // GET: api/OperationTypes?pageNumber={pageNumber}&?name={name}&?specialization={specialization}&?status={status}
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<OperationTypeDto>>> Get([FromQuery] string? pageNumber, [FromQuery] string? name, [FromQuery] string? specialization, [FromQuery] string? status)
        {
            var operationTypes = await _service.GetAsync(name, specialization, status);

            if (operationTypes == null)
            {
                return Ok(new { operationTypes = new List<OperationTypeDto>{}, totalItems = 0 });
            }

            var totalItems = operationTypes.Count;

            if (pageNumber != null && int.TryParse(pageNumber, out int page))
            {
                var paginatedOperationTypes = operationTypes
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
                operationTypes = paginatedOperationTypes;
            }

            return Ok(new { operationTypes = operationTypes, totalItems = totalItems });
        }

        // GET: api/OperationTypes/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<OperationTypeDto>> GetById(Guid id)
        {
            var operationType = await _service.GetByIdAsync(new OperationTypeId(id));

            if (operationType == null)
            {
                return NotFound();
            }

            return Ok (new { operationType });
        }

        // POST: api/OperationTypes
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OperationTypeDto>> Create([FromBody] CreatingOperationTypeDto dto)
        {
            if (dto == null)
            {
                _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Error, new Message("Error creating operation type: DTO is null"));
                return BadRequest("Creating Operation Type DTO cannot be null");
            }

            var code = await _service.AssignCodeAsync();

            var operationType = await _service.GetByNameAsync(dto.Name);
            if (operationType != null)
            {
                _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Error, new Message("Error creating operation type: name already exists"));
                return BadRequest("Operation Type with this name already exists");
            }

            operationType = await _service.AddAsync(dto, code);

            _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Create, new Message($"Create {operationType.OperationTypeCode}"));
            return CreatedAtAction(nameof(GetById), new { id = operationType.Id }, operationType);
        }

        
        // PUT: api/OperationTypes/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OperationTypeDto>> Update(Guid id, [FromBody] OperationTypeDto dto)
        {
            try
            {
                if (id != dto.Id)
                {
                    return BadRequest( new { Message = "Id in URL does not match id in body" });
                }

                var operationType = await _service.UpdateAsync(dto);
                
                if (operationType == null)
                {
                    _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Error, new Message("Error updating operation type: operation type not found"));
                    return NotFound();
                }
                _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Update, new Message($"Update {operationType.Id}"));
                return Ok(new { operationType = operationType });
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new { ex.Message});
            }
        }

        // DELETE: api/OperationTypes/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OperationTypeDto>> SoftDelete(Guid id)
        {
            var operationType = await _service.GetByIdAsync(new OperationTypeId(id));

            if (operationType == null)
            {
                _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Error, new Message("Error inactivating operation type: operation type not found"));
                return NotFound();
            }

            if (!_service.CheckIfOperationTypeIsActive(operationType))
            {
                _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Error, new Message("Error inactivating operation type: operation type is inactive"));
                return BadRequest(new { Message = "It is not possible to inactivate an already inactive operation type." });
            }

            operationType = await _service.InactivateAsync(new OperationTypeId(id));

            var operationRequest = await _operationRequestService.DeleteWithOperationTypeAsync(operationType.Name);
            if (operationRequest == null) {
                _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Error, new Message("Error inactivating operation type: name not found while deleting operation requests"));
                return NotFound();
            }

            _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Deactivate, new Message($"Deactivate {operationType.Id}"));
            return Ok();
        }
        
        // DELETE: api/OperationTypes/{id}/hard
        [HttpDelete("{id}/hard")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OperationTypeDto>> HardDelete(Guid id)
        {
            try
            {
                var operationType = await _service.DeleteAsync(new OperationTypeId(id));

                if (operationType == null)
                {
                    _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Error, new Message("Error deleting operation type: operation type not found"));
                    return NotFound();
                }

                if (_service.CheckIfOperationTypeIsActive(operationType))
                {
                    _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Error, new Message("Error deleting operation type: operation type is active"));
                    return BadRequest(new { Message = "It is not possible to delete an active operation type." });
                }

                _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Delete, new Message($"Delete {operationType.Id}"));
                return Ok(operationType);
            }
            catch(BusinessRuleValidationException ex)
            {
               return BadRequest(new {ex.Message});
            }
        }
    }
}