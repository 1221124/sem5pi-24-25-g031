using System.Threading.Tasks;
using System.Collections.Generic;
using Domain.Shared;
using Domain.OperationTypes;
using System;
using Domain.DBLogs;
using Domain.Users;
using Domain.Staff;
using Domain.Patients;

namespace Domain.OperationRequests
{
    public class OperationRequestService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationRequestRepository _repo;
        private readonly IOperationTypeRepository _operationTypeRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IStaffRepository _staffRepository;
        private readonly IDBLogRepository _logRepository;


        public OperationRequestService(IUnitOfWork unitOfWork, IOperationRequestRepository repo,
        IPatientRepository patientRepository, IStaffRepository staffRepository, IDBLogRepository logRepository)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
            _patientRepository = patientRepository;
            _staffRepository = staffRepository;
            _logRepository = logRepository;
        }

        private static Task<DateTime> DeadlineDateValidation(string datetime){
            if (!DateTime.TryParse(datetime, out DateTime output)){
                throw new ArgumentException("Invalid date format for 'deadline date'.");
            } else return Task.FromResult(output);
        }

        private static Task<Priority> PriorityValidation(string priority){
            if (!Enum.TryParse(priority, out Priority output)){
                throw new ArgumentException("Invalid priority format.");
            } else return Task.FromResult(output);
        }

        private static Task<OperationTypeId> OperationTypeValidation(string operationTypeId){
            if (!Guid.TryParse(operationTypeId, out Guid output)){
                throw new ArgumentException("Invalid operation type id format.");
            } else return Task.FromResult(new OperationTypeId(output));
        }
        
        private static Task<RequestStatus> RequestStatusValidation(string status){
            if (!Enum.TryParse(status, out RequestStatus output)){
                throw new ArgumentException("Invalid status format.");
            } else return Task.FromResult(output);
        }   

        public async Task<OperationRequestDto> AddAsync(CreatingOperationRequestDto dto)
        {
            try{
                DateTime deadlineDate = await DeadlineDateValidation(dto.DeadlineDate);

                Priority priority = await PriorityValidation(dto.Priority);

                OperationTypeId operationTypeId = await OperationTypeValidation(dto.OperationTypeId);

                RequestStatus requestStatus = await RequestStatusValidation(dto.Status);

                OperationRequest category = new OperationRequest(
                    new(dto.PatientId), new(dto.StaffId), operationTypeId, 
                    deadlineDate, priority, requestStatus
                    );

                await this._repo.AddAsync(category);
                await this._unitOfWork.CommitAsync();

                var logEntry = new DBLog(
                    EntityType.OPERATION_REQUEST, DBLogType.CREATE, DateTime.Now, new UserId(Guid.NewGuid()), category.Id.AsGuid()
                    );

                await _logRepository.AddAsync(logEntry);
                
                return new OperationRequestDto {
                    Id = category.Id.AsGuid()
                };

            }catch(Exception e){
                var logEntry = _logRepository.AddAsync(new DBLog(e.ToString()));

                return new OperationRequestDto{};
            }
        }


        public async Task<List<OperationRequestDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            
            List<OperationRequestDto> listDto = list.ConvertAll<OperationRequestDto>(
                cat => new OperationRequestDto{ 
                    Id = cat.Id.AsGuid(), 
                    OperationTypeId = cat.OperationTypeId, 
                    DeadlineDate = cat.DeadlineDate, 
                    Priority = cat.Priority
                    }
                );

            return listDto;
        }

        public async Task<OperationRequestDto> GetByIdAsync(string id)
        {

            try{
                OperationRequestId operationRequestId = new(id);
            
                var category = await this._repo.GetByIdAsync(id); 

                if (category == null)
                    return null;

                return new OperationRequestDto {
                    Id = category.Id.AsGuid(), OperationTypeId = category.OperationTypeId, 
                    DeadlineDate = category.DeadlineDate, Priority = category.Priority, Status = category.Status
                };
            }
            catch(Exception e){
                var logEntry = _logRepository.AddAsync(new DBLog(e.ToString()));
                return new OperationRequestDto{};
            }
        }


        public async Task<OperationRequestDto> UpdateAsync(OperationRequestDto dto)
        {
            try{
                OperationRequestId operationRequestId = new(dto.Id.ToString());

                var category = await this._repo.GetByIdAsync(dto.Id.ToString()); 

                if (category == null)
                    return null;

                category.Update(
                    dto.PatientId, dto.DoctorId, dto.OperationTypeId, dto.DeadlineDate, dto.Priority, dto.Status 
                    );

                await this._repo.UpdateAsync(category);
                await this._unitOfWork.CommitAsync();

                var logEntry = new DBLog(
                    EntityType.OPERATION_REQUEST, DBLogType.UPDATE, DateTime.Now, new UserId(Guid.NewGuid()), category.Id.AsGuid()
                    );

                await _logRepository.AddAsync(logEntry);

                return new OperationRequestDto {
                    Id = category.Id.AsGuid()
                };

            }catch(Exception e){
                var logEntry = _logRepository.AddAsync(new DBLog(e.ToString()));
                return new OperationRequestDto{};
            }
        }

         public async Task<OperationRequestDto> DeleteAsync(string id)
        {

            try{
                OperationRequestId operationRequestId = new(id);

                var category = await this._repo.GetByIdAsync(id); 

                if (category == null)
                    return null;   
                
                this._repo.Remove(category);
                await this._unitOfWork.CommitAsync();

                return new OperationRequestDto {
                    Id = category.Id.AsGuid()
                };

            }catch (Exception e){
                var logEntry = _logRepository.AddAsync(new DBLog(e.ToString()));
                return null;
            }
        }  
    }
}