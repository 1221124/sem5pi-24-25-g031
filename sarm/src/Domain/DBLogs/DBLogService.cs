using DDDNetCore.Domain.DbLogs;
using Domain.Shared;

namespace Domain.DbLogs
{
    public class DbLogService
    {
        private readonly IDbLogRepository _logRepository;
        private readonly IUnitOfWork _unitOfWork;
        
        public DbLogService(IDbLogRepository logRepository, IUnitOfWork unitOfWork)
        {
            _logRepository = logRepository;
            _unitOfWork = unitOfWork;
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
            try
            {
                await _logRepository.AddAsync(log);
                await _unitOfWork.CommitAsync();
                return log;
            }
            catch(Exception e)
            {
                LogError(EntityType.Log, DbLogType.Error, e.Message);
                return null;
            }
        }
    }
}