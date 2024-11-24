using DDDNetCore.Domain.Surgeries;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.DbLogs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DDDNetCore.Controllers {
    
    [ApiController]
    [Route("api/[controller]")]
    public class SurgeryRoomsController : ControllerBase
    {
        private readonly SurgeryRoomService _surgeryRoomService;
        private readonly DbLogService _logService;

        public SurgeryRoomsController(SurgeryRoomService surgeryRoomService, DbLogService logService)
        {
            _surgeryRoomService = surgeryRoomService;
            _logService = logService;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<SurgeryRoomNumber>>> GetAll()
        {
            try{
                var rooms = await _surgeryRoomService.GetAll();
                
                if(rooms == null || rooms.Count == 0)
                    return NotFound();

                var roomNumbers = rooms.Select(room => SurgeryRoomNumberUtils.ToString(room.SurgeryRoomNumber)).ToList();

                return Ok(new { roomNumbers });
            }
            catch(Exception ex){
                return BadRequest(new { error = "Error fetching surgery room numbers", details = ex.Message });
            }
        }

        [HttpPost]
        [Authorize (Roles = "Admin")]
        public async Task<ActionResult<SurgeryRoom>> Create(
            [FromQuery] string surgeryRoomNumber,
            [FromQuery] string roomType, 
            [FromQuery] string roomCapacity,
            [FromQuery] string assignedEquipment
            )
        {
            try
            {
                var surgery = SurgeryRoomMapper.ToCreating(surgeryRoomNumber, roomType, roomCapacity, assignedEquipment);
                
                var createdSurgery = await _surgeryRoomService.AddAsync(surgery);
                return CreatedAtAction(nameof(Create), new { id = createdSurgery.Id }, createdSurgery);
            }
            catch(Exception ex){
                return BadRequest("Error: " + ex.Message);
            }
        }
    }
}