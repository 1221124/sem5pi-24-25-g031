using DDDNetCore.Domain.Appointments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DDDNetCore.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase {
        private readonly int pageSize = 2;
        private readonly AppointmentService _service;

        public AppointmentsController(AppointmentService service) {
            _service = service;
        }

        // GET: api/Appointments?pageNumber={pageNumber}
        [HttpGet]
        [Authorize(Roles = "Admin")]
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
                var paginatedOperationTypes = appointments
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
                appointments = paginatedOperationTypes;
            }

            return Ok(new { appointments = appointments, totalItems = totalItems });
        }
    }
}