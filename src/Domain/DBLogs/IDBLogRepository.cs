using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Shared;


namespace Domain.DBLogs
{
    public interface IDBLogRepository : IRepository<DBLog, DBLogId>
    {
        new Task<DBLog> AddAsync(DBLog log);
    }
}