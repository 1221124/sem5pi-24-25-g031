using Domain.DbLogs;
using Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.DbLogs
{
    public class DbLogRepository : BaseRepository<DbLog, DbLogId>, IDbLogRepository
    {

        private readonly DbSet<DbLog> _objs; 
        
        public DbLogRepository(SARMDbContext context):base(context.DbLogs)
        {
            this._objs = context.DbLogs;
        }
        
        public async Task<List<DbLog?>> GetByEntityLogTypeAsync(EntityType entityType, DbLogType logType)
        {
            return (await _objs
                .AsQueryable().Where(x=> entityType.Equals(x.LogType)).Where(x=>logType.Equals(x.LogType)).ToListAsync())!;
        }
    }
}