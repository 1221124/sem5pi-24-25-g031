using Microsoft.AspNetCore.Mvc;
using Domain.OperationRequests;

using System.Threading.Tasks;
using System;
using DDDNetCore.Domain.Patients;

using Domain.DBLogs;
using Microsoft.EntityFrameworkCore;

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
            try{
                var operationRequests = await _operationRequestService.GetAllAsync();
                if(operationRequests == null)
                    return NotFound();

                return Ok(operationRequests);

            }catch(Exception ex){
                //_DBLogService.LogError(OperationRequestEntityType, ex.Message);
                return BadRequest("Error: " + ex.Message);
            }
        }

        // GET api/operationrequest/5
        [HttpGet("{id}")]
        public ActionResult<OperationRequest> Get(string id)
        {  
            try{
                if(id == null)
                    return BadRequest("Operation request ID is required.");

                var operationRequestDto = _operationRequestService.GetByIdAsync(new OperationRequestId(id));

                    if (operationRequestDto == null)
                        return NotFound();

                return Ok(operationRequestDto);

            }catch(Exception ex){
                //_DBLogService.LogError(OperationRequestEntityType, ex.Message);
                return BadRequest("Error: " + ex.Message);
            }
        }

        // Body{staffId, patientId, suggestedDeadline, priority, status}
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatingOperationRequestDto requestDto)
        {
            if (requestDto == null)
            {
                return BadRequest("Operation Request data is required.");
            }

            try
            {
                var operationRequest = await _operationRequestService.AddAsync(requestDto);
                return Ok(operationRequest);
            }
            catch (DbUpdateException dbEx)
            {
                return BadRequest(dbEx.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //PUT api/operationrequest/update
        /*[HttpPost("update")]
        public async Task<IActionResult> Update(UpdatingOperationRequestDto dto)
        {
            try{
                if (dto == null){
                    _DBLogService.LogError(EntityType.OPERATION_REQUEST, "Operation request data is required.");
                    return BadRequest("Operation request data is required.");
                }

                var operationRequestDto = await _operationRequestService.GetByIdAsync(dto.Id);
                if(operationRequestDto == null)
                    return NotFound();

                var operationRequest = await _operationRequestService.UpdateAsync(OperationRequestMapper.ToEntityFromUpdating(dto, operationRequestDto));

                if(operationRequest == null) return NotFound();
                return Ok("Operation request updated successfully.");

            }catch(Exception ex){
                //_DBLogService.LogError(OperationRequestEntityType, ex.Message);
                return BadRequest("Error in Update: " + ex.Message);
            }
        }*/   

        // DELETE api/operationrequest/5
        [HttpDelete("delete/{id}")]
        public IActionResult Delete(OperationRequestDto dto)
        {
            try{   
                var operationRequestId = new OperationRequestId(dto.Id);

                var operationRequestDto = _operationRequestService.DeleteAsync(operationRequestId);

                if (operationRequestDto == null)
                    return NotFound();
                    else
                    return Ok("Operation Request was deleted successfully.");
            }catch(Exception ex){
                //_DBLogService.LogError(OperationRequestEntityType, ex.Message);
                return BadRequest("Error in Delete: " + ex.Message); 
            }
        }
    }
}