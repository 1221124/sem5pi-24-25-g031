using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.DbLogs;
using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.Patients;
using Domain.DbLogs;
using Domain.Patients;
using Domain.Shared;
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

        // GET: api/Appointments
        [HttpGet]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAll()
        {
            var appointments = await _service.GetAll();

            if (appointments == null)
            {
                appointments = [];
            }

            return Ok(new { appointments = appointments, totalItems = appointments.Count });
        }

        // GET: api/Appointments/staff?licenseNumber={licenseNumber}
        [HttpGet("staff")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetByStaff([FromQuery] string licenseNumber)
        {
            var appointments = await _service.GetByStaff(licenseNumber);

            if (appointments == null)
            {
                appointments = [];
            }

            return Ok(new { appointments = appointments, totalItems = appointments.Count });
        }

        // GET: api/Appointments/patient?medicalRecordNumber={medicalRecordNumber}
        [HttpGet("patient")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetByPatient([FromQuery] string medicalRecordNumber)
        {
            var requests = await _operationRequestService.GetByPatientAsync(int.Parse(medicalRecordNumber));
            var appointments = new List<AppointmentDto>();
            if (requests == null || requests.Count == 0)
            {
                appointments = [];
            } else {
                appointments = await _service.GetByRequestCodesAsync(requests.Select(r => r.RequestCode).ToList());

                if (appointments == null)
                {
                    appointments = [];
                }
            }

            return Ok(new { appointments = appointments, totalItems = appointments.Count });
        }

        // POST: api/Appointments
        [HttpPost]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<AppointmentDto>> Create(CreatingAppointmentDto creatingAppointment)
        {
            var appointment = await _service.AddAsync(creatingAppointment);

            if (appointment == null)
            {
                return BadRequest("An exception occurred while creating the appointment!");
            }

            var operationRequest = await _operationRequestService.UpdateStatus(appointment.RequestCode, RequestStatus.ACCEPTED);
            if (operationRequest == null)
            {
                await _service.DeleteAsync(new AppointmentId(appointment.Id));
                return NotFound("Operation request not found!");
            }

            _ = await _logService.CreateLogAsync(new DbLog(new EntityTypeName(EntityType.Appointment), new DbLogTypeName(DbLogType.Create), new Message($"Appointment {appointment.AppointmentNumber} created.")));
            return Ok(new { Message = "Appointment created successfully!" });
        }

        // PATCH: api/Appointments/{id}
        [HttpPatch("{id}")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<AppointmentDto>> Update(Guid id, UpdatingAppointmentDto dto)
        {   
            var appointment = await _service.UpdateAsync(new AppointmentId(id), dto);

            if (appointment == null)
            {
                return NotFound("Appointment not found!");
            }

            var operationRequest = await _operationRequestService.UpdateStatus(appointment.RequestCode, RequestStatus.ACCEPTED);
            if (operationRequest == null)
            {
                await _service.DeleteAsync(new AppointmentId(appointment.Id));
                return NotFound("Operation request not found!");
            }

            _ = await _logService.CreateLogAsync(new DbLog(new EntityTypeName(EntityType.Appointment), new DbLogTypeName(DbLogType.Update), new Message($"Appointment {appointment.AppointmentNumber} updated.")));
            return Ok(new { Message = "Appointment updated successfully!" });
        }

        // DELETE: api/Appointments/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<AppointmentDto>> Delete(Guid id)
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

            _ = await _logService.CreateLogAsync(new DbLog(new EntityTypeName(EntityType.Appointment), new DbLogTypeName(DbLogType.Delete), new Message($"Appointment {appointment.AppointmentNumber} deleted.")));
            return Ok(new { Message = "Appointment deleted successfully!" });
        }
    }
}