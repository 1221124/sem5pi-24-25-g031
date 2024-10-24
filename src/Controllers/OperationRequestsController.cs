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
        [HttpPost("request")]
        public async Task<IActionResult> Create([FromBody] CreatingOperationRequestDto requestDto)
        {
        
            if(requestDto == null){
                //_DBLogService.LogError(OperationRequestEntityType, "Operation request data is required.");
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
                return BadRequest("Error in OperationRequestController.Create");
            }

            return Ok(operationRequest);
        }

        //PUT api/operationrequest/update
        [HttpPost("/update")]
        public async Task<IActionResult> Update(CreatingOperationRequestDto dto)
        {
            if (dto == null){
                _DBLogService.LogError(EntityType.OPERATION_REQUEST, "Operation request data is required.");
                return BadRequest("Operation request data is required.");
            }

            var operationRequest = await _operationRequestService.UpdateAsync(OperationRequestMapper.ToEntityFromCreating(dto));

            if(operationRequest == null) return BadRequest("Error in OperationRequestController.Update");
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