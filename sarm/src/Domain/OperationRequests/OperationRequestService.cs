using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.Patients;
using Domain.DbLogs;
using Domain.Shared;
using Domain.OperationTypes;

namespace Domain.OperationRequests
{
    public class OperationRequestService : IOperationRequestService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationRequestRepository _repo;
        private readonly PatientService _patientService;
        private readonly DbLogService _logService;

        public OperationRequestService(IUnitOfWork unitOfWork, IOperationRequestRepository repo,
        PatientService patientService, DbLogService logService)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            _patientService = patientService;
            _logService = logService;
        }        

        public async Task<OperationRequestDto?> AddAsync(CreatingOperationRequestDto requestDto)
        {
            try
            {
                var operationRequest = OperationRequestMapper.ToEntityFromCreating(requestDto);

                await this._repo.AddAsync(operationRequest);
                await this._unitOfWork.CommitAsync();
                
                _logService.LogAction(EntityType.OperationRequest, DbLogType.Create, "Created {" + operationRequest.Id.Value + "}");
                
                return OperationRequestMapper.ToDto(operationRequest);
            }
            catch (Exception e)
            {
                _logService.LogAction(EntityType.OperationRequest, DbLogType.Create, e.ToString());
                return null;
            }
        }

        public async Task<OperationRequestDto?> GetByIdAsync(OperationRequestId operationRequestId)
        {
            try
            {
                var category = await this._repo.GetByIdAsync(operationRequestId);
                
                if (category == null)
                    return null;

                return OperationRequestMapper.ToDto(category);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<List<OperationRequestDto>> GetAllAsync()
        {
            try
            {
                var list = await _repo.GetAllAsync();

                if(list == null || list.Count == 0)
                {
                    return [];
                }

                return OperationRequestMapper.ToDtoList(list);

            }
            catch (Exception)
            {
                return [];
            }
        }

        public async Task<List<OperationRequestDto>> GetByPatientNameAsync(FullName fullName)
        {
            try
            {
                var patients = await this._patientService.GetAllAsync();
                var operations = await this._repo.GetAllAsync();

                if (patients == null ||patients.Count == 0 || operations == null || operations.Count == 0)
                {
                    return [];
                }
                
                List<OperationRequest> list = new();

                foreach (var pat in patients)
                {
                    if (pat.FullName.Equals(fullName))
                    {
                        foreach (var op in operations)
                        {
                            if (op.PatientId.AsGuid().Equals(pat.Id))
                            {
                                list.Add(op);
                            }
                        }
                    }
                }

                if (list == null)
                {
                    return [];
                }
                
                return OperationRequestMapper.ToDtoList(list);
            }
            catch (Exception)
            {
                return [];
            }
        }

        public async Task<List<OperationRequestDto>> GetByOperationTypeAsync(OperationTypeId operationType)
        {
            try
            {
                var list = await _repo.GetByOperationType(operationType);

                if (list == null)
                    return [];

                return OperationRequestMapper.ToDtoList(list);
            }
            catch (Exception)
            {
                return [];
            }
        }

        public async Task<List<OperationRequestDto>?> GetByRequestStatusAsync(RequestStatus requestStatus)
        {
            try
            {
                var list = await _repo.GetByStatusId(requestStatus);

                if (list == null)
                    return [];

                return OperationRequestMapper.ToDtoList(list);
            }
            catch (Exception)
            {
                return [];
            }
        }

        public async Task<OperationRequestDto?> UpdateAsync(UpdatingOperationRequestDto dto)
        {
            var entity = EntityType.OperationRequest;
            var log = DbLogType.Update;
            
            try
            {
                var operationRequest = await _repo.GetByIdAsync(dto.Id);

                var newOperationRequest = OperationRequestMapper.ToEntityFromUpdating(dto, operationRequest);

                if(operationRequest == null){
                    _logService.LogAction(entity, log, "Unable to update {" + newOperationRequest.Id  + "}");
                    return null;
                }

                operationRequest.ChangeDeadlineDate(newOperationRequest.DeadlineDate);
                operationRequest.ChangePriority(newOperationRequest.Priority);
                operationRequest.ChangeStatus(newOperationRequest.Status);

                await _repo.UpdateAsync(operationRequest);
                await _unitOfWork.CommitAsync();

                _logService.LogAction(entity, log, "Updated {" + operationRequest.Id + "}");
                return OperationRequestMapper.ToDto(operationRequest);

            }
            catch (Exception e)
            {
                _logService.LogAction(entity, log, e.ToString());
                return null;
            }
        }

        public async Task<OperationRequestDto?> DeleteAsync(OperationRequestId id)
        {
            var entity = EntityType.OperationRequest;
            var log = DbLogType.Delete;
            
            try
            {
                var category = await this._repo.GetByIdAsync(id);

                if (category == null){
                    _logService.LogAction(entity, log, "Unable to delete {" + id + "}");
                    return null;
                }
                
                this._repo.Remove(category);
                await this._unitOfWork.CommitAsync();

                _logService.LogAction(entity, log, "Deleted {" + id + "}");

                return OperationRequestMapper.ToDto(id);

            }
            catch (Exception e)
            {
                _logService.LogAction(entity, log, e.ToString());
                return null;
            }
        }
    }
}