using DDDNetCore.Domain.DbLogs;
using DDDNetCore.Domain.Specializations;
using DDDNetCore.src.Domain.RoomTypes;
using Domain.DbLogs;
using Domain.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Controllers{
    
    [Route("api/[controller]")]
    [ApiController]
    public class SpecializationController : ControllerBase
    {
        private readonly SpecializationService _service;
        private readonly DbLogService _dbLogService;

        public SpecializationController(SpecializationService service, DbLogService dbLogService)
        {
            _service = service;
            _dbLogService = dbLogService;
        }
        
        // GET: api/specialization?name={name}
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<SpecializationDto>>> Get([FromQuery] string? name)
        {
            var specializations = await _service.GetAsync(name);

            if (specializations == null)
            {
                specializations = [];
            }

            return Ok(new { specializations = specializations, totalItems = specializations.Count });
        }
        
        // GET: api/specialization/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<SpecializationDto>> GetById(Guid id)
        {
            var specializations = await _service.GetByIdAsync(new SpecializationId(id));

            if (specializations == null)
            {
                return NotFound();
            }

            return Ok (new { specializations });
        }
        
        // POST: api/specialization
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<SpecializationDto>> Create([FromBody] CreatingSpecializationDto dto)
        {
            if (dto == null)
            {
                _ = await _dbLogService.LogAction(EntityType.Specialization, DbLogType.Error, new Message("Error creating Specialization: DTO is null"));
                return BadRequest("Creating Specialization DTO cannot be null");
            }
            
            var specializationWithName = (await _service.GetAsync(dto.Name.Value)).FirstOrDefault();
            if (specializationWithName != null)
            {
                _ = await _dbLogService.LogAction(EntityType.Specialization, DbLogType.Error, new Message("Error creating Specialization: name already exists"));
                return BadRequest("Specialization with this name already exists");
            }

            var specialization = await _service.AddAsync(dto);

            _ = await _dbLogService.LogAction(EntityType.Specialization, DbLogType.Create, new Message($"Create {specialization.SNOMEDCTCode}"));
            return CreatedAtAction(nameof(GetById), new { id = specialization.Id }, specialization);
        }
        
        // PUT: api/Staff/5
        [HttpPut("update/{id}")]
        [Authorize (Roles = "Admin")]
        public async Task<ActionResult<SpecializationDto>> Update(Guid id, [FromBody] SpecializationDto dto)
        {
            try
            {
                if (id != dto.Id)
                {
                    return BadRequest( new { Message = "Id in URL does not match id in body" });
                }

                var specialization = await _service.UpdateAsync(dto);
                
                if (specialization == null)
                {
                    _ = await _dbLogService.LogAction(EntityType.Specialization, DbLogType.Error, new Message("Error updating operation type: operation type not found"));
                    return NotFound();
                }
                _ = await _dbLogService.LogAction(EntityType.Specialization, DbLogType.Update, new Message($"Update {specialization.Id}"));
                return Ok(new { operationType = specialization });
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new { ex.Message});
            }

        }


    }
    
}
