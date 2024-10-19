using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Log
{
    public class LogService : ILogService
    {
        private readonly ILogRepository _logRepository;

        public LogService(ILogRepository logRepository)
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

        public async Task<Log> CreateLogAsync(Log log)
        {
            return await _logRepository.CreateLogAsync(log);
        }
    }
}