using DDDNetCore.Domain.DBLogs;
using Domain.DBLogs;

namespace Domain.DbLogs
{
    public class DbLogService
    {
        private readonly IDbLogRepository _logRepository;


        public DbLogService(IDbLogRepository logRepository)
        {
            _logRepository = logRepository;
        }

        public async void LogError(EntityType entityType, DbLogType dbLogType, Message message)
        {
            var log = new DbLog(entityType, dbLogType, message);

            await CreateLogAsync(log);
        }

        public async void LogAction(EntityType entityType, DbLogType logType, Message message)
        {
            try
            {
                var log = new DbLog(entityType, logType, message:"Action: " + message);

                if (log == null)
                {
                    LogError(EntityType.Log, DbLogType.Error, "Error creating log: log value 'null'.");
                }
                else _ = await CreateLogAsync(log);
            }
            catch (Exception e)
            {
                LogError(EntityType.Log, DbLogType.Error, e.Message);
            }
        }

        public async Task<IEnumerable<DbLog>> GetLogsAsync()
        {
            return await _logRepository.GetAllAsync();
        }

        private async Task<DbLog> CreateLogAsync(DbLog log)
        {
            return await _logRepository.AddAsync(log);
        }
    }
}