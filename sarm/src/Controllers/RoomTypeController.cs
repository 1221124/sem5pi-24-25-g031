using Microsoft.AspNetCore.Mvc;
using Domain.DbLogs;
using DDDNetCore.Domain.DbLogs;
using Microsoft.AspNetCore.Authorization;
using DDDNetCore.src.Domain.RoomTypes;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomTypeController : ControllerBase
    {
        private readonly RoomTypeService _service;
        private readonly DbLogService _dbLogService;

        public RoomTypeController(RoomTypeService service, DbLogService dbLogService)
        {
            _service = service;
            _dbLogService = dbLogService;
        }

        // GET: api/roomTypes?name={name}&isAvailableForSurgeries={isAvailableForSurgeries}
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<RoomTypeDto>>> Get([FromQuery] string? name, [FromQuery] bool? isAvailableForSurgeries)
        {
            var roomTypes = await _service.GetAsync(name, isAvailableForSurgeries);

            if (roomTypes == null)
            {
                return Ok(new { roomTypes = new List<RoomTypeDto>{}, totalItems = 0 });
            }

            return Ok(new { roomTypes = roomTypes, totalItems = roomTypes.Count });
        }

        // GET: api/roomTypes/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<RoomTypeDto>> GetById(Guid id)
        {
            var roomType = await _service.GetByIdAsync(new RoomTypeId(id));

            if (roomType == null)
            {
                return NotFound();
            }

            return Ok (new { roomType });
        }

        // POST: api/roomTypes
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<RoomTypeDto>> Create([FromBody] CreatingRoomTypeDto dto)
        {
            if (dto == null)
            {
                _ = await _dbLogService.LogAction(EntityType.RoomType, DbLogType.Error, new Message("Error creating operation type: DTO is null"));
                return BadRequest("Creating Operation Type DTO cannot be null");
            }

            var code = await _service.AssignCodeAsync();

            var roomTypeWithName = await _service.GetAsync(dto.Name.Value, null);
            if (roomTypeWithName != null && roomTypeWithName.Count > 0)
            {
                _ = await _dbLogService.LogAction(EntityType.RoomType, DbLogType.Error, new Message("Error creating operation type: name already exists"));
                return BadRequest("Operation Type with this name already exists");
            }

            var roomType = await _service.AddAsync(dto, code);

            _ = await _dbLogService.LogAction(EntityType.RoomType, DbLogType.Create, new Message($"Create {roomType.RoomTypeCode}"));
            return CreatedAtAction(nameof(GetById), new { id = roomType.Id }, roomType);
        }

        
        // // PUT: api/roomTypes/{id}
        // [HttpPut("{id}")]
        // [Authorize(Roles = "Admin")]
        // public async Task<ActionResult<OperationTypeDto>> Update(Guid id, [FromBody] OperationTypeDto dto)
        // {
        //     try
        //     {
        //         if (id != dto.Id)
        //         {
        //             return BadRequest( new { Message = "Id in URL does not match id in body" });
        //         }

        //         var operationType = await _service.UpdateAsync(dto);
                
        //         if (operationType == null)
        //         {
        //             _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Error, new Message("Error updating operation type: operation type not found"));
        //             return NotFound();
        //         }
        //         _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Update, new Message($"Update {operationType.Id}"));
        //         return Ok(new { operationType = operationType });
        //     }
        //     catch(BusinessRuleValidationException ex)
        //     {
        //         return BadRequest(new { ex.Message});
        //     }
        // }

        // // DELETE: api/roomTypes/{id}
        // [HttpDelete("{id}")]
        // [Authorize(Roles = "Admin")]
        // public async Task<ActionResult<OperationTypeDto>> SoftDelete(Guid id)
        // {
        //     var operationType = await _service.GetByIdAsync(new OperationTypeId(id));

        //     if (operationType == null)
        //     {
        //         _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Error, new Message("Error inactivating operation type: operation type not found"));
        //         return NotFound();
        //     }

        //     if (!_service.CheckIfOperationTypeIsActive(operationType))
        //     {
        //         _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Error, new Message("Error inactivating operation type: operation type is inactive"));
        //         return BadRequest(new { Message = "It is not possible to inactivate an already inactive operation type." });
        //     }

        //     operationType = await _service.InactivateAsync(new OperationTypeId(id));

        //     var operationRequest = await _operationRequestService.DeleteWithOperationTypeAsync(operationType.Name);
        //     if (operationRequest == null) {
        //         _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Error, new Message("Error inactivating operation type: name not found while deleting operation requests"));
        //         return NotFound();
        //     }

        //     _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Deactivate, new Message($"Deactivate {operationType.Id}"));
        //     return Ok();
        // }
        
        // // DELETE: api/roomTypes/{id}/hard
        // [HttpDelete("{id}/hard")]
        // [Authorize(Roles = "Admin")]
        // public async Task<ActionResult<OperationTypeDto>> HardDelete(Guid id)
        // {
        //     try
        //     {
        //         var operationType = await _service.DeleteAsync(new OperationTypeId(id));

        //         if (operationType == null)
        //         {
        //             _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Error, new Message("Error deleting operation type: operation type not found"));
        //             return NotFound();
        //         }

        //         if (_service.CheckIfOperationTypeIsActive(operationType))
        //         {
        //             _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Error, new Message("Error deleting operation type: operation type is active"));
        //             return BadRequest(new { Message = "It is not possible to delete an active operation type." });
        //         }

        //         _ = await _dbLogService.LogAction(EntityType.OperationType, DbLogType.Delete, new Message($"Delete {operationType.Id}"));
        //         return Ok(operationType);
        //     }
        //     catch(BusinessRuleValidationException ex)
        //     {
        //        return BadRequest(new {ex.Message});
        //     }
        // }
    }
}