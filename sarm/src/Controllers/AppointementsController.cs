using Domain.DbLogs;
using Microsoft.AspNetCore.Mvc;
using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.Surgeries;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.OperationRequests;
using Domain.Shared;
using Domain.Staffs;
using Domain.OperationTypes;

namespace DDDNetCore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly int _pageSize = 2;
        private readonly AppointmentService _service;
        private readonly OperationRequestService _operationRequestService;
        private readonly OperationTypeService _operationTypeService;
        private readonly StaffService _staffService;
        private readonly DbLogService _logService;
        private readonly int pageNumber;

        public AppointmentsController(AppointmentService service, OperationRequestService operationRequestService, OperationTypeService operationTypeService, StaffService staffService, DbLogService logService)
        {
            _service = service;
            _operationRequestService = operationRequestService;
            _operationTypeService = operationTypeService;
            _staffService = staffService;
            _logService = logService;
        }

        // GET api/appointements?date={date}
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAsync([FromQuery] string? date)
        {
            try
            {
                List<Appointment> appointements = [];
                if (date == null)
                    appointements = await _service.GetAll();
                else 
                    appointements = await _service.GetByDateAsync(new AppointmentDate(date));
                
                if(appointements == null || appointements.Count == 0)
                    return NotFound();

                return Ok(appointements);
                
            }catch(Exception ex){
                return BadRequest("Error: " + ex.Message);
            }
        }
        
        // //GET ALL
        // [HttpGet]
        // public async Task<ActionResult<IEnumerable<Appointment>>> GetAll()
        // {
        //     try
        //     {
        //         var appointments = await _service.GetAll();
                
        //         if(appointments == null)
        //             return NotFound();

        //         return Ok(appointments);
                
        //     }catch(Exception ex){
        //         return BadRequest("Error: " + ex.Message);
        //     }
        // }
        
        [HttpPost]
        public async Task<ActionResult<Appointment>> Post([FromBody] CreatingAppointment appointment) {
            try
            {
                if (appointment == null)
                    return BadRequest();
                
                var newAppointment = await _service.AddAsync(appointment);
                
                if(newAppointment == null)
                    return BadRequest();

                var operationRequests = await _operationRequestService.GetFilteredAsync(
                    appointment.OperationRequestId.Value,
                    null, null, null, null, null, null
                );

                if (operationRequests == null || operationRequests.Count != 1)
                    return NotFound();

                var operationRequest = operationRequests[0];

                var operationType = await _operationTypeService.GetByNameAsync(operationRequest.OperationType);
                if (operationType == null)
                    return NotFound();

                var staff = await _staffService.GetByLicenseNumber(operationRequest.Staff);

                if (staff == null)
                    return NotFound();

                var updatedStaff = await _staffService.AddAppointment(staff, newAppointment, operationType);
                if (updatedStaff == null)
                    return BadRequest();

                return Ok(newAppointment);
                
            }catch(Exception ex){
                return BadRequest("Error: " + ex.Message);
            }
        }
        
        // [HttpDelete]
        // public async Task<ActionResult<Appointment>> Delete([FromQuery] string id)
        // {
        //     try
        //     {
        //         var appointment = await _service.DeleteAsync(new AppointmentId(id));
        //         
        //         if(appointment == null)
        //             return NotFound();
        //
        //         return Ok(appointment);
        //         
        //     }catch(Exception ex){
        //         return BadRequest("Error: " + ex.Message);
        //     }
        // }
    }
}