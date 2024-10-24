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
    }
}