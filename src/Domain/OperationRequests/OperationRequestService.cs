using Domain.Shared;
using Domain.OperationTypes;
using Domain.DBLogs;
using Domain.Staffs;
using Domain.Patients;

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
            _unitOfWork = unitOfWork;
            _repo = repo;
            _patientService = patientService;
            _logService = logService;
        }        

        public async Task<OperationRequestDto?> AddAsync(OperationRequest operationRequest)
        {
            try{
                await _repo.AddAsync(operationRequest);
                
                Console.WriteLine("Operation Request added successfully");

                await _unitOfWork.CommitAsync();


                Console.WriteLine("Operation Request commited successfully");

                // _logService.LogAction(OperationRequestEntityType, DBLogType.CREATE, operationRequest);

                /*_patientService.UpdateAsync(
                    new PatientDto(
                        category.PatientId, dto.AppointmentHistory.add(operationRequestId)
                        )
                    );
                );*/

                return OperationRequestMapper.ToDto(operationRequest);

            }catch (Exception){
                // _logService.LogError(OperationRequestEntityType, e.ToString());
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

        public async Task<List<OperationRequestDto>> GetByPatientNameAsync(string name)
        {
            try
            {
                FullName fullName = new(name);

                var patients = await this._patientService.GetAllAsync();
                var operations = await this._repo.GetAllAsync();

                if (patients == null ||patients.Count == 0 || operations == null || operations.Count == 0)
                {
                    return OperationRequestMapper.ToDtoList();
                }

                var list = patients.Where(x => x.FullName.Equals(fullName)).ToList();

                if (list == null || list.Count == 0)
                {
                    return OperationRequestMapper.ToDtoList();
                }

                var final = operations.Where(x => list.Any(y => y.Id.Equals(x.PatientId))).ToList();

                return OperationRequestMapper.ToDtoList(final);
            }
            catch (Exception)
            {
                return OperationRequestMapper.ToDtoList();
            }
        }

        public async Task<List<OperationRequestDto>> GetByOperationTypeAsync(string operationTypeId)
        {
            try
            {
                OperationTypeId operationType = new(operationTypeId);

                var list = await _repo.GetByOperationType(operationType);

                if (list == null)
                    return OperationRequestMapper.ToDtoList();

                return OperationRequestMapper.ToDtoList(list);
            }
            catch (Exception)
            {
                return OperationRequestMapper.ToDtoList();
            }
        }

        public async Task<List<OperationRequestDto>> GetByRequestStatusAsync(string status)
        {
            try
            {
                RequestStatus requestStatus = RequestStatusUtils.FromString(status);

                var list = await _repo.GetByStatusId(requestStatus);

                if (list == null)
                    return OperationRequestMapper.ToDtoList();

                return OperationRequestMapper.ToDtoList(list);
            }
            catch (Exception)
            {
                return OperationRequestMapper.ToDtoList();
            }
        }

        public async Task<OperationRequestDto> UpdateAsync(OperationRequest operationRequest)
        {
            try
            {
                OperationRequest op = await _repo.GetByIdAsync(operationRequest.Id);

                if(op == null){
                    _logService.LogError(OperationRequestEntityType, "Unable to find {operationRequest " + operationRequest.Id  + "}");
                    return OperationRequestMapper.ToDto(operationRequest);
                }

                op.ChangeDeadlineDate(operationRequest.DeadlineDate);
                op.ChangePriority(operationRequest.Priority);
                op.ChangeStatus(operationRequest.Status);

                await _repo.UpdateAsync(op);
                await _unitOfWork.CommitAsync();

                _logService.LogAction(OperationRequestEntityType, DBLogType.UPDATE, op.Id.AsGuid());
                return OperationRequestMapper.ToDto(op);

            }
            catch (Exception e)
            {
                _logService.LogError(OperationRequestEntityType, e.ToString());
                return OperationRequestMapper.ToDto(operationRequest);
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