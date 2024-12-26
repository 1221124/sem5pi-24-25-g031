using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.OperationRequests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DDDNetCore.PrologIntegrations
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrologController : ControllerBase {
        private readonly PrologService _service;
        private readonly AppointmentService _appointmentService;
        private readonly OperationRequestService _operationRequestService;

        public PrologController(PrologService service, AppointmentService appointmentService, OperationRequestService operationRequestService)
        {
            _service = service;
            _appointmentService = appointmentService;
            _operationRequestService = operationRequestService;
        }
        
        //POST: api/Prolog?option={option}&surgeryRoom={surgeryRoom}&date={date} (surgery room is optional)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> RunProlog([FromBody] PrologParams prologParams)
        {
            try
            {
                var surgeryRoomNumber = prologParams.SurgeryRoomNumber;
                var dateTime = prologParams.DateTime;
                var option = prologParams.Option;

                var initialAppointments = await _appointmentService.GetByDateAsync(dateTime);
                initialAppointments ??= [];
                
                var operationRequests = await _operationRequestService.GetFilteredAsync(
                    null, null, null, null, null, null, RequestStatusUtils.ToString(RequestStatus.PENDING)
                );

                if (operationRequests == null || operationRequests.Count == 0) return NoContent();

                var value = await _service.CreateKB(surgeryRoomNumber, dateTime);
                if(!value.done) return BadRequest(new {message = value.message});

                if (option != 0 && option != 1 && option != 2) return BadRequest(new {message = "Invalid option."});

                var response = _service.RunPrologEngine(surgeryRoomNumber, dateTime, option);
                if (response == null) {
                    return BadRequest(new {message = "Appointments couldn't be created due to staff's incompatibility.\nPlease, try again later."});
                }
                var codesAndAppointments = await _appointmentService.CreateAppointmentsAutomatically(dateTime, response);

                var appointments = await _appointmentService.GetByDateAsync(dateTime);
                appointments ??= [];

                if (appointments.Count == initialAppointments.Count) return NoContent();

                foreach (var code in codesAndAppointments.requestCodes) {
                    var opRequest = await _operationRequestService.GetByCodeAsync(code);
                    if (opRequest == null) return BadRequest(new {message = $"Operation request with code {code} not found!"});

                    var activatedOpRequest = await _operationRequestService.UpdateAsync(OperationRequestMapper.ToUpdatingFromEntity(opRequest, RequestStatus.ACCEPTED));
                }

                value = _service.DestroyKB(dateTime);
                if(!value.done) return BadRequest(new {message = value.message});
                
                return CreatedAtAction("RunProlog", new {id = surgeryRoomNumber+"_"+dateTime.Date.ToString()}, new {message = "Appointments created successfully!"});
            }
            catch (Exception e)
            {
                return BadRequest(new {message = e.Message});
            }
        }
    }
}