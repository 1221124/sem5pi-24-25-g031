using System.Threading.Tasks;
using Domain.DBLogs;
using Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.DBLogs
{
    public class DBLogRepository : BaseRepository<DBLog, DBLogId>, IDBLogRepository
    {

        private readonly DbSet<DBLog> _objs; 

        public DBLogRepository(SARMDbContext context) : base(context.OperationRequests)
        {
            this._objs = context.DBLogs;
        }
        
        public async Task<List<DBLog?>> GetByEntityLogTypeAsync(EntityType entityType, DBLogType logType)
        {
            return (await _objs
                .AsQueryable().Where(x=> entityType.Equals(x.LogType)).Where(x=>logType.Equals(x.LogType)).ToListAsync())!;
        }
    }
}