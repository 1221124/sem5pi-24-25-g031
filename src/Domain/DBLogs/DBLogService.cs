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
            var log = new DBLog(entityType, DBLogType.ERROR, message);

            await CreateLogAsync(log);
        }

        public async void LogAction<T>(EntityType entityType, DBLogType logType, T category) where T : class
        {
            //Guid userId = Guid.Empty;
            Guid entityId = Guid.Empty;

            try{
                    switch (entityType)
                    {
                        case EntityType.OPERATION_REQUEST:
                            OperationRequest? operationRequest = category as OperationRequest;

                            if (operationRequest != null)
                            {
                                entityId = operationRequest.Id.AsGuid();
                            }

                            break;
                        
                        case EntityType.PATIENT:
                            Patient? patient = category as Patient;

                            if(patient != null){
                                entityId = patient.Id.AsGuid();
                            }

                            break;
                        
                        case EntityType.STAFF:
                            Staff? staff = category as Staff;

                            if(staff != null){
                                entityId = staff.Id.AsGuid();
                            }

                            break;

                        case EntityType.USER:
                            User? user = category as User;

                            if(user != null){
                                entityId = user.Id.AsGuid();
                            }

                            break;
                        
                        case EntityType.OPERATION_TYPE:
                            OperationType? operationType = category as OperationType;

                            if(operationType != null){
                                entityId = operationType.Id.AsGuid();
                            }

                            break;
                    }

                    DBLog log = new DBLog(entityType, logType, entityId);

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