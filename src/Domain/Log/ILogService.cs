using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Log
{
    public interface ILogService
    {
        Task<IEnumerable<Log>> GetLogsAsync();

        Task<Log> GetLogAsync(int id);

        Task<Log> CreateLogAsync(Log log);
    }
}
