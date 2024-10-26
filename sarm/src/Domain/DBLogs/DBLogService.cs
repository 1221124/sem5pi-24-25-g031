using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.DBLogs;
using Domain.Users;
using Domain.OperationRequests;
using Domain.Patients;
using Domain.Staffs;
using Domain.Shared;
using Infrastructure;
using Domain.OperationTypes;

namespace Domain.DBLogs
{
    public class DBLogService
    {

        private readonly IDBLogRepository _logRepository;
        private readonly IUserRepository _userRepository;
        private readonly IStaffRepository _staffRepository;
        private readonly IPatientRepository _patientRepository;

        public DBLogService(IDBLogRepository logRepository, IUserRepository userRepository,
                            IStaffRepository staffRepository, IPatientRepository patientRepository)
        {
            _logRepository = logRepository;
            _userRepository = userRepository;
            _staffRepository = staffRepository;
            _patientRepository = patientRepository;
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