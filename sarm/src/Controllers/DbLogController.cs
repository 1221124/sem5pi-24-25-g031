using Domain.DbLogs;
using Domain.Shared;
using Microsoft.AspNetCore.Mvc;


namespace DDDNetCore.Controllers{
//new OP Request GUId= 8127f4a9-09f2-4320-beaf-a4cc0f0ac7dc

    [Route("api/[controller]")]
    [ApiController]
    public class DbLogController
    {

        private const int PageSize = 2;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IDbLogRepository _repo;

        public DbLogController(IUnitOfWork unitOfWork, IDbLogRepository repo, DbLogService logService)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        // POST: api/DbLog
        [HttpPost("id")]
        public async Task<DbLog?> GetByIdAsync(DbLogId id)
        {
            try
            {
                var category = await this._repo.GetByIdAsync(id);

                if (category == null)
                    return null;

                return category;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        // GET: api/DbLog/?pageNumber=1
        [HttpGet]
        public async Task<List<DbLog>> GetAll([FromQuery] string? pageNumber)
        {
            try
            {
                var logs = await this._repo.GetAllAsync();

                if (logs == null)
                    return [];
                
                if (pageNumber != null)
                {
                    var paginated = logs
                        .Skip((int.Parse(pageNumber)) * PageSize)
                        .Take(PageSize)
                        .ToList();
                    return paginated;
                }

                return logs;
            }

            catch (Exception ex)
            {
                return [];
            }
        }
    }
}