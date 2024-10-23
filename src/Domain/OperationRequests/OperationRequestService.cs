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

        private static Task<DateTime> DeadlineDateValidation(string datetime)
        {
            if (!DateTime.TryParse(datetime, out DateTime output))
            {
                throw new ArgumentException("Invalid date format for 'deadline date'.");
            }
            else return Task.FromResult(output);
        }

        private static Task<Priority> PriorityValidation(string priority)
        {
            if (!Enum.TryParse(priority, out Priority output))
            {
                throw new ArgumentException("Invalid priority format.");
            }
            else return Task.FromResult(output);
        }

        private async Task<OperationTypeId> OperationTypeValidation(string operationTypeId, string staffId)
        {
            if (!Guid.TryParse(operationTypeId, out Guid output))
            {
                _logService.LogError(OperationRequestEntityType, "Invalid data format.");
                throw new ArgumentException("Invalid data format.");

            }
            else{

                StaffDto staff = await _staffService.GetByIdAsync(new(staffId));

                OperationTypeDto operationType = await _operationTypeService.GetByIdAsync(new(operationTypeId));

                if(staff.Specialization != operationType.Specialization){
                    _logService.LogError(OperationRequestEntityType, "Staff specialization doesn't match Operation Type.");
                    throw new ArgumentException("Staff specialization doesn't match Operation Type.");
                }         
            
                return new OperationTypeId(output);
            }
        }

        private static Task<RequestStatus> RequestStatusValidation(string status)
        {
            if (!Enum.TryParse(status, out RequestStatus output))
            {
                throw new ArgumentException("Invalid status format.");
            }
            else return Task.FromResult(output);
        }

        public async Task<OperationRequestDto> AddAsync(CreatingOperationRequestDto dto)
        {
            
            DateTime deadlineDate = await DeadlineDateValidation(dto.DeadlineDate);

            Priority priority = await PriorityValidation(dto.Priority);

            OperationTypeId operationTypeId = await OperationTypeValidation(dto.OperationTypeId, dto.StaffId);

            RequestStatus requestStatus = await RequestStatusValidation(dto.Status);

            OperationRequest category = new OperationRequest
                (
                new(dto.PatientId), new(dto.StaffId), operationTypeId,
                deadlineDate, priority, requestStatus
                );

            try{

                await this._repo.AddAsync(category);
                await this._unitOfWork.CommitAsync();

                _logService.LogAction(OperationRequestEntityType, DBLogType.CREATE, category);

                /*_patientService.UpdateAsync(
                    new PatientDto(
                        dto.PatientId, dto.AppointmentHistory.add(category)
                        )
                    );
                );*/

                return new OperationRequestDto(category.Id.AsGuid());            

            }catch (Exception e){
                _logService.LogError(OperationRequestEntityType, e.ToString());
                return new OperationRequestDto(category.Id.AsGuid());            
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


        public async Task<OperationRequestDto> UpdateAsync(OperationRequestDto dto)
        {
            try
            {
                OperationRequestId operationRequestId = new(dto.Id.ToString());

                var category = await this._repo.GetByIdAsync(dto.Id.ToString());

                if (category == null)
                    return null;

                category.Update(
                    dto.PatientId, dto.DoctorId, dto.OperationTypeId, dto.DeadlineDate, dto.Priority, dto.Status
                    );

                await this._repo.UpdateAsync(category);
                await this._unitOfWork.CommitAsync();

                _logService.LogAction(EntityType.OPERATION_REQUEST, DBLogType.UPDATE, category);
                return new OperationRequestDto
                {
                    Id = category.Id.AsGuid()
                };

            }
            catch (Exception e)
            {
                _logService.LogError(EntityType.OPERATION_REQUEST, e.ToString());
                return new OperationRequestDto { };
            }
        }
        public async Task<OperationRequestDto> DeleteAsync(string id)
        {

            try
            {
                OperationRequestId operationRequestId = new(id);

                var category = await this._repo.GetByIdAsync(id);

                if (category == null)
                    return null;

                this._repo.Remove(category);
                await this._unitOfWork.CommitAsync();

                _logService.LogAction(EntityType.OPERATION_REQUEST, DBLogType.DELETE, category);

                return new OperationRequestDto
                {
                    Id = category.Id.AsGuid()
                };

            }
            catch (Exception e)
            {
                _logService.LogError(EntityType.OPERATION_REQUEST, e.ToString());
                return null;
            }
        }
    }
}