using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Domain.OperationRequests;
using System.Threading.Tasks;
using System;
using Domain.DBLogs;
using Domain.Staffs;
using Domain.Patients;
using Domain.OperationTypes;


namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class OperationRequestController : ControllerBase
    {
        private readonly OperationRequestService _operationRequestService;
        private readonly StaffService _staffService;
        private readonly PatientService _patientService;
        private readonly OperationTypeService _operationTypeService;
        private readonly DBLogService _DBLogService;
        private static readonly EntityType OperationRequestEntityType = EntityType.OPERATION_REQUEST;

        public OperationRequestController(OperationRequestService operationRequestService, DBLogService dBLogService, 
        StaffService staffService, PatientService patientService, OperationTypeService operationTypeService)
        {
            _operationRequestService = operationRequestService;
            _DBLogService = dBLogService;
            _staffService = staffService;
            _patientService = patientService;
            _operationTypeService = operationTypeService;
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
                var operationRequestDto = _operationRequestService.GetByIdAsync(id);

                    if (operationRequestDto == null)
                        return NotFound();

                return Ok(operationRequestDto);

            }catch(Exception ex){
                //_DBLogService.LogError(OperationRequestEntityType, ex.Message);
                return BadRequest("Error: " + ex.Message);
            }
        }

        // Body{staffId, patientId, suggestedDeadline, priority, status}
        [HttpPost("request")]
        public async Task<IActionResult> Create([FromBody] CreatingOperationRequestDto requestDto)
        {
            try{    
                if(requestDto == null){
                    return BadRequest("Operation request data is required.");
                }

                var staff = await _staffService.GetByEmailAsync(requestDto.StaffEmail);
                if(staff == null)
                    return BadRequest("Invalid staff provided.");

                var patient = await _patientService.GetByEmailAsync(requestDto.PatientEmail);
                if(patient == null)
                    return BadRequest("Invalid patient provided.");

                var operationType = await _operationTypeService.GetByNameAsync(requestDto.OperationTypeName);
                if(operationType == null)
                    return BadRequest("Invalid operation type provided.");

                var operationRequest = await  _operationRequestService.AddAsync(OperationRequestMapper.ToEntityFromCreating(requestDto, staff, patient, operationType));
            
                if(operationRequest == null){
                    //_DBLogService.LogError(OperationRequestEntityType, "Error in OperationRequestController.Create");
                    return NotFound();
                } return Ok(operationRequest);
                
            }catch(Exception ex){
                //_DBLogService.LogError(OperationRequestEntityType, ex.Message);
                return BadRequest("Error: " + ex.Message);
            }
        }

        //PUT api/operationrequest/update
        [HttpPost("update")]
        public async Task<IActionResult> Update(OperationRequestDto dto)
        {
            try{
                if (dto == null){
                    _DBLogService.LogError(EntityType.OPERATION_REQUEST, "Operation request data is required.");
                    return BadRequest("Operation request data is required.");
                }

                var operationRequest = await _operationRequestService.UpdateAsync(OperationRequestMapper.ToEntity(dto));

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