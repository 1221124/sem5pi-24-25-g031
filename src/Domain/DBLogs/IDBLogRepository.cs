using Domain.Shared;


namespace Domain.DBLogs
{
    public interface IDBLogRepository : IRepository<DBLog, DBLogId>
    {
    }
}