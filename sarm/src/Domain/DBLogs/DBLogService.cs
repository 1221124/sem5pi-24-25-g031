namespace Domain.DBLogs
{
    public class DBLogService
    {

        private readonly IDBLogRepository _logRepository;

        public DBLogService(IDBLogRepository logRepository)
        {
            _logRepository = logRepository;
        }

        public async void LogError(EntityType entityType, string message)
        {
            var log = new DBLog(entityType, message.ToString());

            await CreateLogAsync(log);
        }

        public async void LogAction(EntityType entityType, DBLogType logType, Guid guid) 
        {

            try{
                    DBLog log = new DBLog(entityType, logType, guid);

                    if (log == null){
                        LogError(EntityType.LOG, "Error creating log");
                    }else _ = await CreateLogAsync(log);

            }catch(Exception e){
                LogError(EntityType.LOG, e.Message);
            }           

        }

        public async Task<IEnumerable<DBLog>> GetLogsAsync()
        {
            return await _logRepository.GetAllAsync();
        }
        private async Task<DBLog> CreateLogAsync(DBLog log)
        {
            return await _logRepository.AddAsync(log);
        }
    }
}