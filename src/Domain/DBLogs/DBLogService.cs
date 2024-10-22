using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.DBLogs;
using Domain.Users;
using Domain.OperationRequests;
using Domain.Staffs;

namespace Domain.DBLogs
{
    public class DBLogService{
    
        private readonly IDBLogRepository _logRepository;
        private readonly IUserRepository _userRepository;
        private readonly IStaffRepository _staffRepository; 

        public DBLogService(IDBLogRepository logRepository, IUserRepository userRepository)
        {
            _logRepository = logRepository;
            _userRepository = userRepository;
        }

        public async void LogError(string message)
        {
            var log = new DBLog(message);

            await CreateLogAsync(log);
        }


        public async void LogAction(EntityType entityType, DBLogType logType, OperationRequest category)
        {

            var staff = await _staffRepository.GetByIdAsync(category.DoctorId);

            var log = new DBLog(entityType, logType, staff.UserId, category.Id.AsGuid());

            await CreateLogAsync(log);
        }

        public async Task<IEnumerable<DBLog>> GetLogsAsync()
        {
            return await _logRepository.GetAllAsync();
        }

        public async Task<DBLog> GetLogAsync(int id)
        {
            return await _logRepository.GetByIdAsync(id);
        }

        private async Task<DBLog> CreateLogAsync(DBLog log)
        {
            return await _logRepository.AddAsync(log);
        }
    }
}