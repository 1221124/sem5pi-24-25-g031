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

        public async Task<DbLog> LogError(Message message)
        {
            var entityTypeName = new EntityTypeName(EntityType.Log);
            var logTypeName = new DbLogTypeName(DbLogType.Error);
            
            var log = new DbLog(entityTypeName, logTypeName, message);

            return await CreateLogAsync(log);
        }

        public async Task<DbLog> LogAction(EntityType entityType, DbLogType logType, Message message)
        {
            try
            {
                //var log = new DbLog(entityType, logType, message:"Action: " + message);

                var entityTypeName = new EntityTypeName(entityType);
                var logTypeName = new DbLogTypeName(logType);

                var log = new DbLog(entityTypeName, logTypeName, message);
                
                if (log == null)
                {
                    return await LogError("Error creating log: log value 'null'.");
                }
                else return await CreateLogAsync(log);
            }
            catch (Exception e)
            {
                return await LogError(e.Message);
            }
        }

        public async Task<DbLog> CreateLogAsync(DbLog log)
        {
            await _logRepository.AddAsync(log);
            await _unitOfWork.CommitAsync();
            return log;
        }
    }
}