using DDDNetCore.Domain.DbLogs;
using DDDNetCore.Domain.Specializations;
using DDDNetCore.src.Domain.RoomTypes;
using Domain.DbLogs;
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
        
            Console.WriteLine("vai entrar");
           
            var code = await _service.AssignCodeAsync();
            Console.WriteLine("Code" + code);
            
            var specializationWithName = (await _service.GetAsync(dto.Name.Value)).FirstOrDefault();
            if (specializationWithName != null)
            {
                _ = await _dbLogService.LogAction(EntityType.Specialization, DbLogType.Error, new Message("Error creating Specialization: name already exists"));
                return BadRequest("Specialization with this name already exists");
            }

            var specialization = await _service.AddAsync(dto, code);

            _ = await _dbLogService.LogAction(EntityType.Specialization, DbLogType.Create, new Message($"Create {specialization.SNOMEDCTCode}"));
            return CreatedAtAction(nameof(GetById), new { id = specialization.Id }, specialization);
        }

    }
    
}
