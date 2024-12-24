using System.Globalization;
using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.Patients;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.Staffs;
using Microsoft.AspNetCore.Authorization;
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
        
        //POST: api/Prolog?option={option}&surgeryRoom={surgeryRoom}&date={date}
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> RunProlog([FromBody] PrologParams prologParams)
        {
            try
            {
                var surgeryRoomNumber = prologParams.SurgeryRoomNumber;
                var dateTime = prologParams.DateTime;
                var option = prologParams.Option;

                var value = await _service.CreateKB(surgeryRoomNumber, dateTime);
                if(!value.done) return BadRequest(new {message = value.message});

                if (option != 0 && option != 1) return BadRequest(new {message = "Invalid option."});

                var response = _service.RunPrologEngine(surgeryRoomNumber, dateTime, option);
                if (response == null) return BadRequest(new {message = "Appointments couldn't be created due to staff's incompatibility.\nPlease, try again later."});

                var codesAndAppointments = await _appointmentService.CreateAppointmentsAutomatically(surgeryRoomNumber, dateTime, response);

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