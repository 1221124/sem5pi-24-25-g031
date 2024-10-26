using Microsoft.AspNetCore.Mvc;
using Domain.Shared;
using Domain.OperationTypes;
using Microsoft.AspNetCore.Authorization;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationTypesController : ControllerBase
    {
        private readonly OperationTypeService _service;

        public OperationTypesController(OperationTypeService service)
        {
            _service = service;
        }

        // GET: api/OperationTypes
        [HttpGet]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<IEnumerable<OperationTypeDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/OperationTypes/id/{id}
        [HttpGet("id/{id}")]
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

        // GET: api/OperationTypes/specialization/{specialization}
        [HttpGet("specialization/{specialization}")]
        public async Task<ActionResult<List<OperationTypeDto>>> GetBySpecialization(Specialization specialization)
        {
            var operationTypes = await _service.GetBySpecializationAsync(specialization);

            if (operationTypes == null)
            {
                return NotFound();
            }

            return operationTypes;
        }

        // GET: api/OperationTypes/status/{status}
        [HttpGet("status/{status}")]
        public async Task<ActionResult<List<OperationTypeDto>>> GetByStatus(Status status)
        {
            var operationTypes = await _service.GetByStatusAsync(status);

            if (operationTypes == null)
            {
                return NotFound();
            }

            return operationTypes;
        }

        // POST: api/OperationTypes
        [HttpPost]
        public async Task<ActionResult<OperationTypeDto>> Create([FromBody] CreatingOperationTypeDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Creating Operation Type DTO cannot be null");
            }

            var operationType = await _service.GetByNameAsync(dto.Name);
            if (operationType != null)
            {
                return BadRequest("Operation Type with this name already exists");
            }

            operationType = await _service.AddAsync(dto);

            return CreatedAtAction(nameof(GetById), new { id = operationType.Id }, operationType);
        }

        
        // PUT: api/OperationTypes/5
        [HttpPut("{id}")]
        public async Task<ActionResult<OperationTypeDto>> Update(OperationTypeDto dto)
        {
            try
            {
                var operationType = await _service.UpdateAsync(dto);
                
                if (operationType == null)
                {
                    return NotFound();
                }
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
                return NotFound();
            }

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
                    return NotFound();
                }

                return Ok(operationType);
            }
            catch(BusinessRuleValidationException ex)
            {
               return BadRequest(new {Message = ex.Message});
            }
        }
    }
}