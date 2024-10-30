using Domain.Shared;


namespace Domain.DbLogs
{
    public interface IDbLogRepository : IRepository<DbLog, DbLogId> 
    {
        
    }
}