using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.DbLogs;
using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.Patients;
using Domain.DbLogs;
using Domain.Staffs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DDDNetCore.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase {
//         delete from [dbo].[Appointments];
// delete from [dbo].[Staffs_SlotAppointement];
// delete from [dbo].[Patients_AppointmentHistory];
// update [dbo].[OperationRequests] set RequestStatus = 'pending';

        private readonly int pageSize = 2;
        private readonly AppointmentService _service;
        private readonly DbLogService _logService;
        private readonly StaffService _staffService;
        private readonly PatientService _patientService;
        private readonly OperationRequestService _operationRequestService;

        public AppointmentsController(AppointmentService service, DbLogService logService, StaffService staffService, PatientService patientService, OperationRequestService operationRequestService)
        {
            _service = service;
            _logService = logService;
            _staffService = staffService;
            _patientService = patientService;
            _operationRequestService = operationRequestService;
        }

        // GET: api/Appointments?pageNumber={pageNumber}
        [HttpGet]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAll([FromQuery] string? pageNumber)
        {
            var appointments = await _service.GetAll();

            if (appointments == null)
            {
                return NotFound();
            }

            var totalItems = appointments.Count;

            if (pageNumber != null && int.TryParse(pageNumber, out int page))
            {
                var paginatedAppointments = appointments
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
                appointments = paginatedAppointments;
            }

            return Ok(new { appointments = appointments, totalItems = totalItems });
        }

        // POST: api/Appointments
        [HttpPost]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<AppointmentDto>> PostAppointment(CreatingAppointmentDto creatingAppointment)
        {
            var appointment = await _service.AddAsync(creatingAppointment);

            if (appointment == null)
            {
                return BadRequest("An exception occurred while creating the appointment!");
            }

            var operationRequest = await _operationRequestService.UpdateStatus(appointment.RequestCode, RequestStatus.ACCEPTED);
            if (operationRequest == null)
            {
                return NotFound("Operation request not found!");
            }

            var staff = await _staffService.CreateAppointmentAsync(appointment);
            if (staff == null || staff.Count == 0)
            {
                return BadRequest("An exception occurred while creating the appointment slots in all staffs!");
            }

            var patient = await _patientService.CreateAppointmentAsync(operationRequest, appointment);
            if (patient == null)
            {
                return NotFound("Patient not found!");
            }

            _ = await _logService.CreateLogAsync(new DbLog(new EntityTypeName(EntityType.Appointment), new DbLogTypeName(DbLogType.Create), new Message($"Appointment {appointment.AppointmentNumber} created.")));
            return Ok(new { Message = "Appointment created successfully!" });
        }

        // DELETE: api/Appointments/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<AppointmentDto>> DeleteAppointment(Guid id)
        {
            var appointment = await _service.DeleteAsync(new AppointmentId(id));

            if (appointment == null)
            {
                return NotFound("Appointment not found!");
            }

            var operationRequest = await _operationRequestService.UpdateStatus(appointment.RequestCode, RequestStatus.PENDING);
            if (operationRequest == null)
            {
                return NotFound("Operation request not found!");
            }

            var staff = await _staffService.DeleteAppointmentAsync(appointment);
            if (staff == null || staff.Count == 0)
            {
                return BadRequest("An exception occurred while deleting the appointment slots in all staffs!");
            }

            var patient = await _patientService.DeleteAppointmentAsync(operationRequest, appointment);
            if (patient == null)
            {
                return NotFound("Patient not found!");
            }

            _ = await _logService.CreateLogAsync(new DbLog(new EntityTypeName(EntityType.Appointment), new DbLogTypeName(DbLogType.Delete), new Message($"Appointment {appointment.AppointmentNumber} deleted.")));
            return Ok(new { Message = "Appointment deleted successfully!" });
        }
    }
}