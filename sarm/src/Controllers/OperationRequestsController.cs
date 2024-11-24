using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.DbLogs;
using Microsoft.AspNetCore.Mvc;
using Domain.OperationTypes;
using Domain.Shared;
using DDDNetCore.Domain.OperationRequests;
using Date = System.DateOnly;
using Microsoft.AspNetCore.Authorization;

namespace DDDNetCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationRequestController : ControllerBase
    {
        private readonly int _pageSize = 2;
        private readonly OperationRequestService _operationRequestService;
        private readonly DbLogService _logService;

        public OperationRequestController(OperationRequestService operationRequestService, DbLogService logService)
        {
            _operationRequestService = operationRequestService;
            _logService = logService;
        }

        // GET api/operationrequest
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<OperationRequestDto>>> Get([FromQuery] string? pageNumber)
        {
            try
            {
                var operationRequests = await _operationRequestService.GetAllAsync();
                
                if(operationRequests == null)
                    return NotFound();

                if (pageNumber != null)
                {
                    var paginated = operationRequests
                        .Skip((int.Parse(pageNumber)) *
                              _pageSize) // Pula os primeiros itens de acordo com o número da página e o tamanho da página
                        .Take(_pageSize) // Seleciona a quantidade especificada de itens para a página atual
                        .ToList(); // Converte o resultado em uma lista para fácil manipulação

                    return Ok(paginated);
                }

                return Ok(operationRequests);
                
            }catch(Exception ex){
                return BadRequest("Error: " + ex.Message);
            }
        }

        // GET api/operationrequest/filtered
        [HttpGet("filtered")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<OperationRequestDto>>> GetFiltered(
            [FromQuery] string? searchId,
            [FromQuery] string? searchLicenseNumber,
            [FromQuery] string? searchPatientName,
            [FromQuery] string? searchOperationType,
            [FromQuery] string? searchDeadlineDate,
            [FromQuery] string? searchPriority,
            [FromQuery] string? searchRequestStatus
        ){
            try{
                var operationRequests = await _operationRequestService.GetFilteredAsync(
                    searchId,
                    searchLicenseNumber, 
                    searchPatientName, 
                    searchOperationType, 
                    searchDeadlineDate, 
                    searchPriority, 
                    searchRequestStatus
                    );

                if(operationRequests == null || operationRequests.Count == 0)
                    return NotFound();

                return Ok(operationRequests);
            }
            catch(Exception ex)
            {
                return BadRequest("Error: " + ex.Message);
            }
        }

        // POST: api/operationRequests
        [HttpPost]
        [Authorize(Roles = "Doctor")]
        // [Route("operationRequests")]
        public async Task<ActionResult<OperationRequestDto>>Create([FromBody] CreatingOperationRequestDto dto)
        {
            var entity = EntityType.OperationRequest;
            var log = DbLogType.Create;
            
            try
            {
                if (dto == null)
                {
                    await _logService.LogAction(entity, log,"Creating Operation Type DTO cannot be null");
                    return BadRequest("Creating Operation Type DTO cannot be null");
                }

                var code = await _operationRequestService.AssignCodeAsync();

                var operationRequest = await _operationRequestService.AddAsync(dto, code);

                if (operationRequest == null)
                {
                    await _logService.LogAction(EntityType.OperationRequest, DbLogType.Create,
                        "Operation Request was not created.");
                    return BadRequest("Operation Request was not created.");
                }

                return CreatedAtAction(nameof(Get), new { id = operationRequest.Id }, operationRequest);
            }
            catch (Exception ex)
            {
                await _logService.LogAction(entity, log, "Error in Create: " + ex.Message);
                return BadRequest("Error in Create: " + ex.Message);
            }

            // Console.WriteLine("Received a request");
            // return Ok(new { message = "Request successful" });
        }

        //PUT api/operationrequest
        [HttpPut]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult<OperationRequestDto>> Update([FromBody] UpdatingOperationRequestDto dto)
        {
            try{
                if (dto == null) {
                    await _logService.LogAction(EntityType.OperationRequest, DbLogType.Update,"Operation request data is required.");
                    return BadRequest(dto);
                }

                var operationRequest = await _operationRequestService.UpdateAsync(dto);

                if(operationRequest == null)
                    return NotFound(dto);

                return Ok(dto);

            }catch(Exception ex){
                await _logService.LogAction(EntityType.OperationRequest, DbLogType.Update, ex.Message);
                return BadRequest(dto);
            }
        }

        // DELETE api/operationrequest/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult<OperationRequestDto>> Delete(string id)
        {
            try
            {
                if (id == null) return BadRequest();
                
                var operationRequestDto = await _operationRequestService.DeleteAsync(new OperationRequestId(id));

                if (operationRequestDto == null)
                    return NotFound();
                
                return Ok(new { message = "Operation Request deleted successfully." });
            }
            catch(Exception ex)
            {
                await _logService.LogAction(EntityType.OperationType, DbLogType.Delete, ex.Message);
                return BadRequest("Error in Delete: " + ex.Message); 
            }
        }
    }
}