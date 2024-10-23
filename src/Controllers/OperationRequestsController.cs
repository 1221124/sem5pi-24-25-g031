using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Domain.OperationRequests;
using System.Threading.Tasks;
using System;
using Domain.DBLogs;


namespace Controllers
{
     [Route("api/[controller]")]
     [ApiController]
    
     public class OperationRequestController : ControllerBase
     {
         private readonly OperationRequestService _operationRequestService;
         private readonly DBLogService _DBLogService;

         private static readonly EntityType OperationRequestEntityType = EntityType.OPERATION_REQUEST;

         public OperationRequestController(OperationRequestService operationRequestService, DBLogService dBLogService)
         {
             _operationRequestService = operationRequestService;
             _DBLogService = dBLogService;
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
         public ActionResult<OperationRequest> Get(string id)
         {  
             try{
                 var operationRequestDto = _operationRequestService.GetByIdAsync(id);

                     if (operationRequestDto == null){
                         return NotFound();
                     }

                 return Ok(operationRequestDto);

             }catch(Exception){
                 _DBLogService.LogError(OperationRequestEntityType, "Error in OperationRequestController.Get");
                 return NotFound();
             }
         }

         // Body{staffId, patientId, suggestedDeadline, priority, status}
         [HttpPost("operationrequest/request")]
         public async Task<IActionResult> Create(CreatingOperationRequestDto requestDto)
         {
             if (requestDto == null){
                _DBLogService.LogError(OperationRequestEntityType, "Invalid data request.");
                 return BadRequest("Invalid request data.");
             }

            await _operationRequestService.AddAsync(OperationRequestMapper.ToEntityFromCreating(requestDto));

            return Ok("Operation request created successfully.");
         }

         // PUT api/operationrequest/update
         [HttpPost("operationrequest/update")]
         public async Task<IActionResult> Update(CreatingOperationRequestDto dto)
         {
             if (dto == null){
                _DBLogService.LogError(EntityType.OPERATION_REQUEST, "Operation request data is required.");
                 return BadRequest("Operation request data is required.");
             }

             await _operationRequestService.UpdateAsync(OperationRequestMapper.ToEntityFromCreating(dto));

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