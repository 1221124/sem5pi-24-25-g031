
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
                if (response == null) return BadRequest(new {message = "Appointments couldn't be created due to staff's incompatibility.\nPlease, try again later."});

                var codesAndAppointments = await _appointmentService.CreateAppointmentsAutomatically(surgeryRoomNumber, dateTime, response);

                foreach (var code in codesAndAppointments.requestCodes) {
                    var opRequest = await _operationRequestService.GetByCodeAsync(code);
                    if (opRequest == null) return BadRequest(new {message = $"Operation request with code {code} not found!"});

                    var activatedOpRequest = await _operationRequestService.UpdateAsync(OperationRequestMapper.ToUpdatingFromEntity(opRequest, RequestStatus.ACCEPTED));
                }

                var staffAgenda = await _staffService.CreateSlotAppointments(dateTime, response);

                foreach (var staff in staffAgenda.Keys) {
                    var staffAppointments = staffAgenda[staff];

                    foreach (var appointmentNumber in staffAppointments) {
                        var appointment = await _appointmentService.GetByAppointmentNumberAsync(appointmentNumber);
                        if (appointment == null) return BadRequest(new {message = "Appointment couldn't be created!"});
                        await _appointmentService.AssignStaff(appointment, staff);
                    }
                }

                return Ok(new {message = "Appointments created successfully!"});
            }
            catch (Exception e)
            {
                return BadRequest(new {message = e.Message});
            }
        }
    }
}