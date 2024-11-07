using Domain.DbLogs;
using Microsoft.AspNetCore.Mvc;
using Domain.OperationRequests;
using Domain.OperationTypes;
using Domain.Shared;
using DDDNetCore.Domain.OperationRequests;

namespace DDDNetCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationRequestController : ControllerBase
    {
        private readonly int _pageSize = 2;
        private readonly OperationRequestService _operationRequestService;
        private readonly DbLogService _logService;
        private IOperationRequestService object1;
        private IDbLogService object2;

        public OperationRequestController(OperationRequestService operationRequestService, DbLogService logService)
        {
            _operationRequestService = operationRequestService;
            _logService = logService;
        }

        // GET api/operationrequest
        [HttpGet]
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

        // GET api/operationrequest/5
        [HttpGet("id/{id}")]
        public async Task<ActionResult<OperationRequestDto>> GetById(Guid id)
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
        public async Task<ActionResult<IEnumerable<OperationRequestDto>>> GetByPatientName(string fullName, string? pageNumber)
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

                if(operationRequests == null || operationRequests.Count == 0)
                    return NotFound();


                if (pageNumber != null)
                {
                    var paginated = operationRequests
                        .Skip((int.Parse(pageNumber) - 1) *
                              _pageSize) // Pula os primeiros itens de acordo com o número da página e o tamanho da página
                        .Take(_pageSize) // Seleciona a quantidade especificada de itens para a página atual
                        .ToList();

                    return Ok(paginated);
                }

                return Ok(operationRequests);
                
            }catch(Exception ex){
                return BadRequest("Error: " + ex.Message);
            }
        }
        
        // GET api/operationrequest/operationtype
        [HttpGet("operationtype/{operationType}")]
        public async Task<ActionResult<IEnumerable<OperationRequestDto>>> GetByOperationType(Guid operationType, string? pageNumber)
        {
            try{
                if(operationType == null)
                    return BadRequest("Operation type is required.");

                var id = new OperationTypeId(operationType);
                
                var operationRequests = await _operationRequestService.GetByOperationTypeAsync(id);

                if(operationRequests == null)
                    return NotFound();

                if (pageNumber != null)
                {
                    var paginated = operationRequests
                        .Skip((int.Parse(pageNumber) - 1) *
                              _pageSize) // Pula os primeiros itens de acordo com o número da página e o tamanho da página
                        .Take(_pageSize) // Seleciona a quantidade especificada de itens para a página atual
                        .ToList();

                    return Ok(paginated);
                }

                return Ok(operationRequests);

            }
            catch(Exception ex)
            {
                return BadRequest("Error: " + ex.Message);
            }
        }

        // GET api/operationrequest/status
        [HttpGet("status/{status}")]
        //[HttpGet("status={status}")]        
        public async Task<ActionResult<IEnumerable<OperationRequestDto>>> GetByStatus(RequestStatus status, string? pageNumber)
        {
            try{
                if(status == null)
                    return BadRequest("Status is required.");

                // var requestStatus = Enum.Parse<RequestStatus>(status);
                
                var operationRequests = await _operationRequestService.GetByRequestStatusAsync(status);

                if(operationRequests == null)
                    return NotFound();

                if (pageNumber != null)
                {
                    var paginated = operationRequests
                        .Skip((int.Parse(pageNumber) - 1) *
                              _pageSize) // Pula os primeiros itens de acordo com o número da página e o tamanho da página
                        .Take(_pageSize) // Seleciona a quantidade especificada de itens para a página atual
                        .ToList();

                    return Ok(paginated);
                }
                
                return Ok(operationRequests);

            }
            catch(Exception ex)
            {
                return BadRequest("Error: " + ex.Message);
            }
        }
        
        // POST: api/OperationTypes
        [HttpPost]
        // [Route("operationRequests")]
        public async Task<ActionResult<OperationRequestDto>> Create([FromBody] CreatingOperationRequestDto dto)
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

                var operationRequest = await _operationRequestService.AddAsync(dto);

                if (operationRequest == null)
                {
                    await _logService.LogAction(EntityType.OperationRequest, DbLogType.Create,
                        "Operation Request was not created.");
                    return BadRequest("Operation Request was not created.");
                }

                return CreatedAtAction(nameof(GetById), new { id = operationRequest.Id }, operationRequest);
            }
            catch (Exception ex)
            {
                await _logService.LogAction(entity, log, "Error in Create: " + ex.Message);
                return BadRequest("Error in Create: " + ex.Message);
            }
        }

        //PUT api/operationrequest/update
        [HttpPut("update")]
        public async Task<ActionResult<OperationRequestDto>> Update([FromBody] UpdatingOperationRequestDto dto)
        {
            try{
                if (dto == null) {
                    await _logService.LogAction(EntityType.OperationRequest, DbLogType.Update,"Operation request data is required.");
                    return BadRequest("Operation request data is required.");
                }

                var operationRequest = await _operationRequestService.UpdateAsync(dto);

                if(operationRequest == null)
                    return NotFound();

                return Ok(operationRequest);

            }catch(Exception ex){
                await _logService.LogAction(EntityType.OperationRequest, DbLogType.Update, ex.Message);
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
                await _logService.LogAction(EntityType.OperationType, DbLogType.Delete, ex.Message);
                return BadRequest("Error in Delete: " + ex.Message); 
            }
        }
    }
}