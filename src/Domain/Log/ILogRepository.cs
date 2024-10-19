using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Log
{
    public interface ILogRepository
    {
        Task<Log> CreateLogAsync(Log log);
        Task<Log> GetLogAsync(int id);
        Task<IEnumerable<Log>> GetLogsAsync();
    }
}