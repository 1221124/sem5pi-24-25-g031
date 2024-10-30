using Domain.DbLogs;
using Microsoft.AspNetCore.Mvc;
using Domain.OperationRequests;
using Domain.DbLogs;
using Domain.OperationTypes;
using Domain.Shared;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationRequestController : ControllerBase
    {
        private readonly int pageSize = 2;
        private readonly OperationRequestService _operationRequestService;
        private readonly DbLogService _logService;

        public OperationRequestController(OperationRequestService operationRequestService, DbLogService logService)
        {
            _operationRequestService = operationRequestService;
            _logService = logService;
        }
        
        // GET api/operationrequest
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OperationRequest>>> Get(int pageNumber)
        {
            try{
                var operationRequests = await _operationRequestService.GetAllAsync();
                if(operationRequests == null)
                    return NotFound();
                
                var paginated = operationRequests
                    .Skip((pageNumber - 1) * pageSize) // Pula os primeiros itens de acordo com o número da página e o tamanho da página
                    .Take(pageSize)                    // Seleciona a quantidade especificada de itens para a página atual
                    .ToList();                         // Converte o resultado em uma lista para fácil manipulação

                return Ok(paginated);

            }catch(Exception ex){
                return BadRequest("Error: " + ex.Message);
            }
        }

        // GET api/operationrequest/5
        [HttpGet("id/{id}")]
        public async Task<ActionResult<OperationTypeDto>> GetById(Guid id)
        {
            try
            {
                var operationRequest = await _operationRequestService.GetByIdAsync(new OperationRequestId(id));

                if (operationRequest == null)
                {
                    return NotFound();
                }

                return Ok(operationRequest);
            }catch(Exception ex)
            {
                return BadRequest("Error: " + ex.Message);
            }
        }
        
        // GET api/operationrequest/patientname
        [HttpGet("patientname/{fullName}")]
        public async Task<ActionResult<IEnumerable<OperationRequest>>> GetByPatientName(string fullName, int pageNumber)
        {
            try{
                if(fullName == null)
                    return BadRequest("Patient name is required.");
                
                var names = fullName.Split("-");

                if (names.Length != 2)
                {
                    return BadRequest("Full name format is invalid. Expected format: FirstName%2LastName");
                }
                
                var name = new FullName(new Name(names[0]), new Name(names[1]));

                var operationRequests = await _operationRequestService.GetByPatientNameAsync(name);

                if(operationRequests == null)
                    return NotFound();

                var paginated = operationRequests
                    .Skip((pageNumber - 1) * pageSize) // Pula os primeiros itens de acordo com o número da página e o tamanho da página
                    .Take(pageSize)                    // Seleciona a quantidade especificada de itens para a página atual
                    .ToList();  

                return Ok(paginated);

            }catch(Exception ex){
                return BadRequest("Error: " + ex.Message);
            }
        }
        
        // GET api/operationrequest/operationtype
        [HttpGet("operationtype/{operationType}")]
        public async Task<ActionResult<IEnumerable<OperationRequest>>> GetByOperationType(string operationType, int pageNumber)
        {
            try{
                if(operationType == null)
                    return BadRequest("Operation type is required.");

                var id = new OperationTypeId(operationType);
                
                var operationRequests = await _operationRequestService.GetByOperationTypeAsync(id);

                if(operationRequests == null)
                    return NotFound();

                var paginated = operationRequests
                    .Skip((pageNumber - 1) * pageSize) // Pula os primeiros itens de acordo com o número da página e o tamanho da página
                    .Take(pageSize)                    // Seleciona a quantidade especificada de itens para a página atual
                    .ToList();  

                return Ok(paginated);

            }
            catch(Exception ex)
            {
                return BadRequest("Error: " + ex.Message);
            }
        }

        // GET api/operationrequest/status
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<OperationRequest>>> GetByStatus(string status, int pageNumber)
        {
            try{
                if(status == null)
                    return BadRequest("Status is required.");

                var requestStatus = Enum.Parse<RequestStatus>(status);
                
                var operationRequests = await _operationRequestService.GetByRequestStatusAsync(requestStatus);

                if(operationRequests == null)
                    return NotFound();

                var paginated = operationRequests
                    .Skip((pageNumber - 1) * pageSize) // Pula os primeiros itens de acordo com o número da página e o tamanho da página
                    .Take(pageSize)                    // Seleciona a quantidade especificada de itens para a página atual
                    .ToList();

                return Ok(paginated);

            }
            catch(Exception ex)
            {
                return BadRequest("Error: " + ex.Message);
            }
        }
        
        
        // POST: api/OperationTypes
        [HttpPost]
        public async Task<ActionResult<OperationRequestDto>> Create([FromBody] CreatingOperationRequestDto dto)
        {
            var entity = EntityType.OperationRequest;
            var log = DbLogType.Create;
            
            try
            {
                if (dto == null)
                {
                    _logService.LogError(entity, log,"Creating Operation Type DTO cannot be null");
                    return BadRequest("Creating Operation Type DTO cannot be null");
                }

                var operationRequest = await _operationRequestService.AddAsync(dto);

                if (operationRequest == null)
                {
                    _logService.LogError(EntityType.OperationRequest, DbLogType.Create,
                        "Operation Request was not created.");
                    return BadRequest("Operation Request was not created.");
                }

                return CreatedAtAction(nameof(GetById), new { id = operationRequest.Id }, operationRequest);
            }
            catch (Exception ex)
            {
                _logService.LogError(entity, log, "Error in Create: " + ex.Message);
                return BadRequest("Error in Create: " + ex.Message);
            }
        }

        //PUT api/operationrequest/update
        [HttpPut("update")]
        public async Task<ActionResult<OperationRequestDto>> Update([FromBody] UpdatingOperationRequestDto dto)
        {
            try{
                if (dto == null) {
                    _logService.LogError(EntityType.OperationRequest, DbLogType.Update,"Operation request data is required.");
                    return BadRequest("Operation request data is required.");
                }

                var operationRequest = await _operationRequestService.UpdateAsync(dto);

                if(operationRequest == null)
                    return NotFound();

                return Ok("Operation request updated successfully.");

            }catch(Exception ex){
                //_DBLogService.LogError(OperationRequestEntityType, ex.Message);
                return BadRequest("Error in Update: " + ex.Message);
            }
        }

        // DELETE api/operationrequest/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<OperationRequestDto>> Delete(Guid id)
        {
            try{   
                var operationRequestDto = await _operationRequestService.DeleteAsync(new OperationRequestId(id));

                if (operationRequestDto == null)
                    return NotFound();
                
                return Ok("Operation request deleted successfully.");
            }
            catch(Exception ex)
            {
                _logService.LogError(EntityType.OperationType, DbLogType.Delete, ex.Message);
                return BadRequest("Error in Delete: " + ex.Message); 
            }
        }
    }
}