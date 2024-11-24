using System.Globalization;
using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.Patients;
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
        private readonly PatientService _patientService;

        public PrologController(PrologService service, AppointmentService appointmentService, StaffService staffService, OperationRequestService operationRequestService, PatientService patientService)
        {
            _service = service;
            _appointmentService = appointmentService;
            _staffService = staffService;
            _operationRequestService = operationRequestService;
            _patientService = patientService;
        }
        
        //api/Prolog?option={option}&surgeryRoom={surgeryRoom}&date={date}
        [HttpGet]
        public async Task<ActionResult> RunProlog([FromQuery] string option, [FromQuery] string surgeryRoom, [FromQuery] string date)
        {
            try
            {
                var surgeryRoomNumber = SurgeryRoomNumberUtils.FromString(surgeryRoom);

                var dateTime = DateTime.ParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture);

                var value = await _service.CreateKB(surgeryRoomNumber, dateTime);
                if(!value.done) return BadRequest(new {message = value.message});

                var optionAsInt = int.Parse(option);
                if (optionAsInt != 0 && optionAsInt != 1) return BadRequest(new {message = "Invalid option."});

                var response = _service.RunPrologEngine(surgeryRoomNumber, dateTime, optionAsInt);
                if (response == null) return BadRequest(new {message = "Appointments couldn't be created due to staff's incompatibility.\nPlease, try again later."});

                var codesAndAppointments = await _appointmentService.CreateAppointmentsAutomatically(surgeryRoomNumber, dateTime, response);

                foreach (var code in codesAndAppointments.requestCodes) {
                    var opRequest = await _operationRequestService.GetByCodeAsync(code);
                    if (opRequest == null) return BadRequest(new {message = $"Operation request with code {code} not found!"});

                    var activatedOpRequest = await _operationRequestService.UpdateAsync(OperationRequestMapper.ToUpdatingFromEntity(opRequest, RequestStatus.ACCEPTED));
                }

                var staffAgenda = await _staffService.CreateSlotAppointments(dateTime, response);

                if (!await _appointmentService.AssignStaff(staffAgenda)) return BadRequest(new {message = "Staff couldn't be assigned to appointments.\nPlease, try again later."});

                Dictionary<AppointmentDto, OperationRequestDto> appointmentsRequests = new Dictionary<AppointmentDto, OperationRequestDto>();
                foreach (var number in codesAndAppointments.appointmentNumbers) {
                    var appointment = await _appointmentService.GetByAppointmentNumberAsync(number);
                    if (appointment == null) return BadRequest(new {message = $"Appointment with number {number} not found!"});

                    var operationRequest = await _operationRequestService.GetByCodeAsync(appointment.RequestCode);
                    if (operationRequest == null) return BadRequest(new {message = $"Operation request with code {appointment.RequestCode} not found!"});

                    appointmentsRequests.Add(appointment, operationRequest);
                }

                var patientHistory = await _patientService.AddAppointmentHistory(appointmentsRequests);

                value = _service.DestroyKB(dateTime);
                if(!value.done) return BadRequest(new {message = value.message});
                
                return Ok(new {message = "Appointments created successfully!"});
            }
            catch (Exception e)
            {
                return BadRequest(new {message = e.Message});
            }
        }
    }
}