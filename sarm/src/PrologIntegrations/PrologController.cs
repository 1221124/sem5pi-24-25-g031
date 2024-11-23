
using System.Globalization;
using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.OperationRequests;
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
        private readonly OperationRequestService _operationRequestService;

        public PrologController(PrologService service, AppointmentService appointmentService, StaffService staffService, OperationRequestService operationRequestService)
        {
            _service = service;
            _appointmentService = appointmentService;
            _staffService = staffService;
            _operationRequestService = operationRequestService;
        }
        
        //api/Prolog?surgeryRoom=or1&date=2045-12-02
        [HttpGet]
        public async Task<ActionResult> RunProlog([FromQuery] string surgeryRoom, [FromQuery] string date)
        {
            try
            {
                var surgeryRoomNumber = SurgeryRoomNumberUtils.FromString(surgeryRoom);

                var dateTime = DateTime.ParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture);

                var value = await _service.CreateKB(surgeryRoomNumber, dateTime);
                if(!value.done) return BadRequest(new {message = value.message});

                var response = _service.RunPrologEngine(surgeryRoomNumber, dateTime);

                Console.WriteLine("Got response!");
                var opRequestsIds = await _appointmentService.CreateAppointmentsAutomatically(surgeryRoomNumber, dateTime, response);

                foreach (var id in opRequestsIds) {
                    var opRequest = await _operationRequestService.GetFilteredAsync(id, null, null, null, null, null, null);
                    if (opRequest == null || opRequest.Count != 1) return BadRequest(new {message = "Error getting operation request..."});

                    var activatedOpRequest = await _operationRequestService.UpdateAsync(OperationRequestMapper.ToUpdatingFromEntity(opRequest[0], RequestStatus.ACCEPTED));
                }

                var staffAgenda = await _staffService.CreateSlotAppointments(dateTime, response);
                
                return Ok(new {message = "Appointments created successfully!"});
            }
            catch (Exception e)
            {
                return BadRequest(new {message = e.Message});
            }
        }
    }
}