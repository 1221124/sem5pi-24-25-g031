using System.Collections.Generic;
using Log;
using Microsoft.AspNetCore.Mvc;
using Domain.OperationRequestAggregate;
using System.Threading.Tasks;
using System;


namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class OperationRequestController : ControllerBase
    {
        private readonly OperationRequestService _operationRequestService;

        public OperationRequestController(OperationRequestService operationRequestService)
        {
            _operationRequestService = operationRequestService;
        }

        // GET api/operationrequest
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OperationRequest>>> Get()
        {
            var operationRequests = await _operationRequestService.GetAllAsync();
            return Ok(operationRequests);
        }

            // GET api/operationrequest/5
            [HttpGet("{id}")]
            public ActionResult<OperationRequest> Get(int id)
            {  
                try{
                    var operationRequestId = new OperationRequestId(id.ToString());

                    var operationRequestDto = _operationRequestService.GetByIdAsync(operationRequestId);

                        if (operationRequestDto == null){
                            return NotFound();
                        }

                    return Ok(operationRequestDto);

                }catch(Exception){

                    return NotFound();
                }
            }

        // Body{{staffId, patientId, suggestedDeadline, priority, status}
        [HttpPost("operationrequest/request")]
        public async Task<IActionResult> CreateOperationRequest([FromBody] OperationRequestDto requestDto)
        {
            if (requestDto == null)
                return BadRequest("Invalid request data.");

            // Create a new OperationRequest object from the DTO
            var operationRequestDto = new CreatingOperationRequestDto(
                requestDto.OperationTypeId,
                requestDto.DeadlineDate,
                requestDto.Priority
            );

            // Add logic to handle the operation request creation
            await _operationRequestService.AddAsync(operationRequestDto);

            return Ok("Operation request created successfully.");
        }

        // PUT api/operationrequest/update/{id}/{updateType}
        [HttpPost("operationrequest/update/{id}/{updateType}")]
        public async Task<IActionResult> UpdateOperationRequest(UpdateType updateType, [FromBody] OperationRequestId id)
        {
            if (id == null)
                return BadRequest("Operation request data is required.");

            OperationRequestDto request = new OperationRequestDto
        {
                Id = id.AsGuid()
            }; 

            // Handle different update types based on the route parameter
            switch (updateType)
            {
                case UpdateType.STATUS:
                    await _operationRequestService.UpdateAsync(request, updateType);
                    break;

                case UpdateType.PRIORITY:
                    await _operationRequestService.UpdateAsync(request, updateType);
                    break;

                case UpdateType.DEADLINE_DATE:
                    await _operationRequestService.UpdateAsync(request, updateType);
                    break;

                default:
                    return BadRequest("Invalid update type.");
            }

            return Ok("Operation request updated successfully.");
        }   

        // DELETE api/operationrequest/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var operationRequestId = new OperationRequestId(id.ToString());

            var operationRequestDto = _operationRequestService.DeleteAsync(operationRequestId);

            if (operationRequestDto == null)
                return NotFound();
                else
                return Ok("Operation Request  was deleted successfully.");
        }
    }
}