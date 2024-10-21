using System.Threading.Tasks;
using Domain.DBLogs;
using Infrastructure.Shared;

namespace Infrastructure.DBLogs
{
    public class DBLogRepository : BaseRepository<DBLog, DBLogId>, IDBLogRepository
    {
    
        public DBLogRepository(SARMDbContext context):base(context.OperationRequests)
        {
            throw new System.NotImplementedException();
        }

        public Task<DBLog> GetByIdAsync(object value)
        {
            throw new System.NotImplementedException();
        }
    }
}