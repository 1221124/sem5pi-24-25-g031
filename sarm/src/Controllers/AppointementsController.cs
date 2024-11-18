using Domain.DbLogs;
using Microsoft.AspNetCore.Mvc;
using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.Surgeries;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.OperationRequests;
using Domain.Shared;

namespace DDDNetCore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly int _pageSize = 2;
        private readonly AppointmentService _service;
        private readonly DbLogService _logService;
        private readonly int pageNumber;

        public AppointmentsController(AppointmentService service, DbLogService logService)
        {
            _service = service;
            _logService = logService;
        }

        // GET planning api/appointements
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetPlanning([FromQuery] string date)
        {
            try
            {
                var appointements = await _service.Planning(new AppointmentDate(date));
                
                if(appointements == null)
                    return NotFound();

                return Ok(appointements);
                
            }catch(Exception ex){
                return BadRequest("Error: " + ex.Message);
            }
        }
        
        //GET ALL
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAll()
        {
            try
            {
                var appointments = await _service.GetAll();
                
                if(appointments == null)
                    return NotFound();

                return Ok(appointments);
                
            }catch(Exception ex){
                return BadRequest("Error: " + ex.Message);
            }
        }
        
        [HttpPost]
        public async Task<ActionResult<Appointment>> Post(
            [FromQuery] string operationRequestId,
            [FromQuery] string surgeryNumber,
            [FromQuery] string appointmentDate
        ){
            try
            {
                var appointment = AppointmentMapper.ToCreating(operationRequestId, surgeryNumber, appointmentDate);

                if (appointment == null)
                    return BadRequest();
                
                var newAppointment = await _service.AddAsync(appointment);
                
                if(newAppointment == null)
                    return NotFound();

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