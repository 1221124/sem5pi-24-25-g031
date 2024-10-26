using DDDNetCore.Domain.Patients;
using Domain.Shared;
using Domain.OperationTypes;
using Domain.DBLogs;

namespace Domain.OperationRequests
{
    public class OperationRequestService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationRequestRepository _repo;
        private readonly PatientService _patientService;
        private readonly DBLogService _logService;
        private static readonly EntityType OperationRequestEntityType = EntityType.OPERATION_REQUEST;

        public OperationRequestService(IUnitOfWork unitOfWork, IOperationRequestRepository repo,
        PatientService patientService, DBLogService logService)
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

                return OperationRequestMapper.ToDto(operationRequest);
            }
            catch (Exception e)
            {
                _logService.LogError(OperationRequestEntityType, e.ToString());
                return null;
            }
        }

        public async Task<OperationRequestDto?> GetByIdAsync(OperationRequestId operationRequestId)
        {
            try
            {
                //OperationRequestId operationRequestId = new(id);

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

        public async Task<List<OperationRequestDto>?> GetByPatientNameAsync(FullName fullName)
        {
            try
            {
                var patients = await this._patientService.GetAllAsync();
                var operations = await this._repo.GetAllAsync();
                var list = patients.Where(x => x.FullName.Equals(fullName)).ToList();


                if (patients == null ||patients.Count == 0 || operations == null || operations.Count == 0 ||list == null || list.Count == 0)
                {
                    return null;
                }

                var final = operations.Where(x => list.Any(y => y.Id.Equals(x.PatientId.AsGuid()))).ToList();

                return OperationRequestMapper.ToDtoList(final);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<List<OperationRequestDto>?> GetByOperationTypeAsync(OperationTypeId operationType)
        {
            try
            {
                var list = await _repo.GetByOperationType(operationType);

                if (list == null)
                    return null;

                return OperationRequestMapper.ToDtoList(list);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<List<OperationRequestDto>?> GetByRequestStatusAsync(RequestStatus requestStatus)
        {
            try
            {
                var list = await _repo.GetByStatusId(requestStatus);

                if (list == null)
                    return null;

                return OperationRequestMapper.ToDtoList(list);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<OperationRequestDto?> UpdateAsync(UpdatingOperationRequestDto dto)
        {
            try
            {
                var operationRequest = await _repo.GetByIdAsync(dto.Id);

                var newOperationRequest = OperationRequestMapper.ToEntityFromUpdating(dto, operationRequest);

                if(operationRequest == null){
                    _logService.LogError(OperationRequestEntityType, "Unable to find {operationRequest " + newOperationRequest.Id  + "}");
                    return null;
                }

                operationRequest.ChangeDeadlineDate(newOperationRequest.DeadlineDate);
                operationRequest.ChangePriority(newOperationRequest.Priority);
                operationRequest.ChangeStatus(newOperationRequest.Status);

                await _repo.UpdateAsync(operationRequest);
                await _unitOfWork.CommitAsync();

                _logService.LogAction(OperationRequestEntityType, DBLogType.UPDATE, operationRequest.Id.AsGuid());
                return OperationRequestMapper.ToDto(operationRequest);

            }
            catch (Exception e)
            {
                _logService.LogError(OperationRequestEntityType, e.ToString());
                return null;
            }
        }

        public async Task<OperationRequestDto> DeleteAsync(OperationRequestId id)
        {
            try
            {
                var category = await this._repo.GetByIdAsync(id);

                if (category == null)
                    return OperationRequestMapper.ToDto(id);

                this._repo.Remove(category);
                await this._unitOfWork.CommitAsync();

                _logService.LogAction(OperationRequestEntityType, DBLogType.DELETE, category.Id.AsGuid());

                return OperationRequestMapper.ToDto(id);

            }
            catch (Exception e)
            {
                _logService.LogError(OperationRequestEntityType, e.ToString());
                return OperationRequestMapper.ToDto(id);
            }
        }
    }
}