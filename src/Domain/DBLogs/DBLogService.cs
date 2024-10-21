using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.DBLogs
{
    public class DBLogService{
    
        private readonly IDBLogRepository _logRepository;

        public DBLogService(IDBLogRepository logRepository)
        {
            _logRepository = logRepository;
        }

        public async Task<IEnumerable<DBLog>> GetLogsAsync()
        {
            return await _logRepository.GetAllAsync();
        }

        public async Task<DBLog> GetLogAsync(int id)
        {
            return await _logRepository.GetByIdAsync(id);
        }

        public async Task<DBLog> CreateLogAsync(DBLog log)
        {
            return await _logRepository.AddAsync(log);
        }
    }
}