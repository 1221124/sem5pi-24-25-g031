using Domain.DbLogs;
using Microsoft.AspNetCore.Mvc;
using DDDNetCore.Domain.Appointments;

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

        // GET api/appointements
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> Get([FromQuery] string date)
        // public IActionResult Get()
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

            // return Ok();
        }
    }
}