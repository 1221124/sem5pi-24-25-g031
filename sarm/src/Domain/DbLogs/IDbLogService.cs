using System.Threading.Tasks;
using DDDNetCore.Domain.DbLogs;
using Domain.Shared;

namespace Domain.DbLogs
{
    public interface IDbLogService
    {
        Task LogAction(EntityType entityType, DbLogType logType, Message message);
    }
}