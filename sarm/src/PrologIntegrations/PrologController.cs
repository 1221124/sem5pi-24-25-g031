
using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.Staffs;
using Microsoft.AspNetCore.Mvc;

namespace DDDNetCore.PrologIntegrations
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrologController : ControllerBase {
        private readonly PrologService _service;
        private readonly AppointmentService _appointmentService;
        private readonly StaffService _staffService;

         public PrologController(PrologService service, AppointmentService appointmentService, StaffService staffService)
         {
            _service = service;
            _appointmentService = appointmentService;
            _staffService = staffService;
         }

        [HttpGet]
        public async Task<IActionResult> RunProlog([FromQuery] string surgeryRoom, [FromQuery] string date)
        {
            try
            {
                var surgeryRoomNumber = SurgeryRoomNumberUtils.FromString(surgeryRoom);
                var dateTime = DateTime.Parse(date); 

                var value = await _service.CreateKB(surgeryRoomNumber, dateTime);
                if(!value.done) return BadRequest(value.message);

                var response = _service.RunPrologEngine(surgeryRoomNumber, dateTime);

                var appointments = await _appointmentService.CreateAppointmentsAutomatically(surgeryRoomNumber, dateTime, response);

                var staffAgenda = await _staffService.CreateSlotAppointments(dateTime, response);
                
                if (appointments)
                    return Ok();

                return BadRequest("Error creating appointments...");
            }
            catch (Exception)
            {
                return BadRequest("Error running prolog to create appointments...");
            }
        }
    }
}