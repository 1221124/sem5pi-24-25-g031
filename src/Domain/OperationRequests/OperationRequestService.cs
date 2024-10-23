using System.Threading.Tasks;
using System.Collections.Generic;
using Domain.Shared;
using Domain.OperationTypes;
using System;
using Domain.DBLogs;
using Domain.Users;
using Domain.Staffs;
using Domain.Patients;

namespace Domain.OperationRequests
{
    public class OperationRequestService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationRequestRepository _repo;
        private readonly DBLogService _logService;
        private readonly OperationTypeService _operationTypeService;
        private readonly StaffService _staffService;
        private readonly PatientService _patientService;
        private static readonly EntityType OperationRequestEntityType = EntityType.OPERATION_REQUEST;

        public OperationRequestService(IUnitOfWork unitOfWork, IOperationRequestRepository repo,
        OperationTypeService operationTypeService, PatientService patientService, StaffService staffService, DBLogService logService)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
            _operationTypeService = operationTypeService;
            _staffService = staffService;
            _patientService = patientService;
            _logService = logService;
        }

        public async Task<OperationRequestDto> AddAsync(OperationRequest operationRequest)
        {
            try{
                await _repo.AddAsync(operationRequest);
                await _unitOfWork.CommitAsync();

                _logService.LogAction(OperationRequestEntityType, DBLogType.CREATE, operationRequest);

                /*_patientService.UpdateAsync(
                    new PatientDto(
                        category.PatientId, dto.AppointmentHistory.add(operationRequestId)
                        )
                    );
                );*/

                return OperationRequestMapper.ToDto(operationRequest);

            }catch (Exception e){
                _logService.LogError(OperationRequestEntityType, e.ToString());
                return OperationRequestMapper.ToDto(operationRequest);     
            }
        }

        public async Task<List<OperationRequestDto>> GetAllAsync()
        {

            try
            {
                var list = await this._repo.GetAllAsync();

                List<OperationRequestDto> listDto = list.ConvertAll<OperationRequestDto>(
                    cat => new OperationRequestDto
                    {
                        Id = cat.Id.AsGuid(),
                        OperationTypeId = cat.OperationTypeId,
                        DeadlineDate = cat.DeadlineDate,
                        Priority = cat.Priority
                    }
                    );

                return listDto;

            }
            catch (Exception e)
            {
                _logService.LogError(EntityType.OPERATION_REQUEST, e.ToString());
                return new List<OperationRequestDto> { };
            }
        }

        public async Task<OperationRequestDto> GetByIdAsync(string id)
        {

            try
            {
                OperationRequestId operationRequestId = new(id);

                var category = await this._repo.GetByIdAsync(id);

                if (category == null)
                    return null;

                return new OperationRequestDto
                {
                    Id = category.Id.AsGuid(),
                    OperationTypeId = category.OperationTypeId,
                    DeadlineDate = category.DeadlineDate,
                    Priority = category.Priority,
                    Status = category.Status
                };
            }
            catch (Exception e)
            {
                _logService.LogError(EntityType.OPERATION_REQUEST, e.ToString());
                return new OperationRequestDto { };
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

                _logService.LogAction(OperationRequestEntityType, DBLogType.UPDATE, op);
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

                _logService.LogAction(OperationRequestEntityType, DBLogType.DELETE, category);

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