using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using Domain.Shared;
using Domain.OperationTypes;

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

        // GET: api/OperationType
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OperationTypeDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/OperationType/5
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

        // POST: api/OperationType
        [HttpPost]
        public async Task<ActionResult<OperationTypeDto>> Create([FromBody] CreatingOperationTypeDto dto)
        {
            var operationType = await _service.AddAsync(dto);

            return CreatedAtAction(nameof(GetById), new { name = operationType.Name }, operationType);
        }

        
        // PUT: api/OperationType/5
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

        // Inactivate: api/OperationType/5
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
        
        // DELETE: api/OperationType/5
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