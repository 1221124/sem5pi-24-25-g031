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
        [HttpPost("request")]
        public async Task<IActionResult> Create([FromBody] CreatingOperationRequestDto requestDto)
        {
            try{    
                if(requestDto == null){
                    return BadRequest("Operation request data is required.");
                }

                var staff = await _staffService.GetByEmailAsync(new(requestDto.StaffEmail.Value));
                if(staff == null)
                    return BadRequest("Invalid staff provided.");

                Console.WriteLine("Staff");

                var patient = await _patientService.GetByEmailAsync(new(requestDto.PatientEmail.Value));
                if(patient == null)
                    return BadRequest("Invalid patient provided.");


                Console.WriteLine("Patient");
                 
                var operationType = await _operationTypeService.GetByNameAsync(new(requestDto.OperationTypeName.Value));
                if(operationType == null)
                    return BadRequest("Invalid operation type provided.");

                Console.WriteLine("OperationType");

                var operationRequest = await  _operationRequestService.AddAsync(OperationRequestMapper.ToEntityFromCreating(requestDto, staff, patient, operationType));

                Console.WriteLine("OperationRequest");

                if(operationRequest == null){
                    //_DBLogService.LogError(OperationRequestEntityType, "Error in OperationRequestController.Create");
                    return NotFound();
                } 

                Console.WriteLine("OK");
                
                return Ok(operationRequest);
                
            }catch(Exception ex){
                //_DBLogService.LogError(OperationRequestEntityType, ex.Message);
                return BadRequest("Error: " + ex.Message);
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