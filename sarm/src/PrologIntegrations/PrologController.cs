
using Microsoft.AspNetCore.Mvc;

namespace DDDNetCore.PrologIntegrations
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrologController : ControllerBase {
        private readonly PrologService _prologIntegration;

         public PrologController(PrologService prologIntegration){
             _prologIntegration = prologIntegration;
         }

        [HttpGet]
        public async Task<IActionResult> ActionResult(
            [FromQuery] string date

                )
        {
            try
            {
                var value = await _prologIntegration.RunProlog(date);

                if(!value.done) return BadRequest(value.message);

                return Ok(value.message);

            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }            
}