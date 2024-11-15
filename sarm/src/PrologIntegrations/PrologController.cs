using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.Surgeries;
using Domain.OperationTypes;
using Domain.Staffs;
using Microsoft.AspNetCore.Mvc;

namespace DDDNetCore.PrologIntegration.PrologIntegrations
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrologController : ControllerBase {
        private readonly PrologIntegration _prologIntegration;
        // private readonly PrologIntegrationService _prologIntegrationService;    
        // private readonly StaffService _staffService;
        // private readonly AppointmentService _appointmentService;
        // private readonly SurgeryService _surgeryService;
        // private readonly OperationTypeService _operationTypeService;

        public PrologController(PrologIntegration prologIntegration/*, PrologIntegrationService prologIntegrationService, 
        StaffService staffService, AppointmentService appointmentService, SurgeryService surgeryService, 
        OperationTypeService operationTypeService*/){
            _prologIntegration = prologIntegration;
            // _prologIntegrationService = prologIntegrationService;
            // _staffService = staffService;
            // _appointmentService = appointmentService;
            // _surgeryService = surgeryService;
            // _operationTypeService = operationTypeService;
        }

        [HttpGet]
        public async Task<IActionResult> IActionResult(
            [FromQuery] string date
        )
        {
            try
            {
                await _prologIntegration.RunProlog(date);

                return Ok();

            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }            
}