using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.DBLogs
{
    public class DBLogService{
    
        private readonly IDBLogRepository _logRepository;

        public LogService(IDBLogRepository logRepository)
        {
            _logRepository = logRepository;
        }

        public async Task<IEnumerable<Log>> GetLogsAsync()
        {
            return await _logRepository.GetLogsAsync();
        }

        public async Task<Log> GetLogAsync(int id)
        {
            return await _logRepository.GetLogAsync(id);
        }

        public async Task<Log> CreateLogAsync(DBLog log)
        {
            return await _logRepository.CreateLogAsync(log);
        }
    }
}