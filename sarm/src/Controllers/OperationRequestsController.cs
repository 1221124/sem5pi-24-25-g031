using Microsoft.AspNetCore.Mvc;
using Domain.OperationRequests;
using Domain.DBLogs;
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
        private readonly DBLogService _DBLogService;
        private static readonly EntityType OperationRequestEntityType = EntityType.OPERATION_REQUEST;

        public OperationRequestController(OperationRequestService operationRequestService, DBLogService dBLogService)
        {
            _operationRequestService = operationRequestService;
            _DBLogService = dBLogService;
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
                return BadRequest("Error: " + ex.Message);
            }
        }
        
        // GET api/operationrequest/patientname
        [HttpPost("patientname/{name}")]
        public async Task<ActionResult<IEnumerable<OperationRequest>>> GetByPatientName(FullName name, int pageNumber)
        {
            try{
                if(name == null)
                    return BadRequest("Patient name is required.");

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
        [HttpPost("operationtype/{operationType}")]
        public async Task<ActionResult<IEnumerable<OperationRequest>>> GetByOperationType(OperationTypeId operationType, int pageNumber)
        {
            try{
                if(operationType == null)
                    return BadRequest("Operation type is required.");

                var operationRequests = await _operationRequestService.GetByOperationTypeAsync(operationType);

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

        // GET api/operationrequest/status
        [HttpPost("status/{status}")]
        public async Task<ActionResult<IEnumerable<OperationRequest>>> GetByStatus(RequestStatus status, int pageNumber)
        {
            try{
                if(status == null)
                    return BadRequest("Status is required.");

                var operationRequests = await _operationRequestService.GetByRequestStatusAsync(status);

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
                
                //if(operationRequest == null)
                   // return BadRequest("Operation Request could not be created.");
                
                return Ok(operationRequest);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //PUT api/operationrequest/update
        [HttpPost("update")]
        public async Task<IActionResult> Update(UpdatingOperationRequestDto dto)
        {
            try{
                if (dto == null){
                    _DBLogService.LogError(EntityType.OPERATION_REQUEST, "Operation request data is required.");
                    return BadRequest("Operation request data is required.");
                }

                var operationRequest = await _operationRequestService.UpdateAsync(dto);

                if(operationRequest == null) return NotFound();
                return Ok("Operation request updated successfully.");

            }catch(Exception ex){
                //_DBLogService.LogError(OperationRequestEntityType, ex.Message);
                return BadRequest("Error in Update: " + ex.Message);
            }
        }   

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