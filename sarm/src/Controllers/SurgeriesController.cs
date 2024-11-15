
using DDDNetCore.Domain.Surgeries;
using Domain.DbLogs;
using Microsoft.AspNetCore.Mvc;

namespace DDDNetCore.Controllers{
    
    [ApiController]
    [Route("api/[controller]")]
    public class SurgeriesController : ControllerBase
    {
        private readonly SurgeryService _surgeryService;
        private readonly DbLogService _logService;

        public SurgeriesController(SurgeryService surgeryService, DbLogService logService)
        {
            _surgeryService = surgeryService;
            _logService = logService;
        }

        [HttpGet]
        public ActionResult<List<Surgery>> GetAllSurgeries()
        {
            try{
                var surgeries = _surgeryService.GetAll();

                if(surgeries == null)
                    return NotFound();

                return Ok(surgeries);
            }
            catch(Exception ex){
                return BadRequest("Error: " + ex.Message);
            }
        }

        [HttpPost]
        public ActionResult<Surgery> CreateSurgery([FromBody] Surgery surgery)
        {
            try{
                var createdSurgery = _surgeryService.AddAsync(surgery);
                return CreatedAtAction(nameof(CreateSurgery), new { id = createdSurgery.Id }, createdSurgery);
            }
            catch(Exception ex){
                return BadRequest("Error: " + ex.Message);
            }
        }
    }
}