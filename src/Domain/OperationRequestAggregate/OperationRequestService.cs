using System.Threading.Tasks;
using System.Collections.Generic;
using Domain.Shared;
using Domain.OperationTypes;
using Log;
using System;

namespace Domain.OperationRequestAggregate
{
    public class OperationRequestService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationRequestRepository _repo;
        private readonly IOperationTypeRepository _operationTypeRepository;
        /*private readonly IPatientRepository _patientRepository;
        private readonly IStaffRepository _staffRepository;*/

        public OperationRequestService(IUnitOfWork unitOfWork, IOperationRequestRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<OperationRequestDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            
            List<OperationRequestDto> listDto = list.ConvertAll<OperationRequestDto>(
                cat => new OperationRequestDto{ 
                    Id = cat.Id.AsGuid(), OperationTypeId = cat.operationTypeId, DeadlineDate = cat.deadlineDate, Priority = cat.priority
                    }
                );

            return listDto;
        }
        public async Task<OperationRequestDto> AddAsync(OperationRequestDto dto)
        {
            
            var category = new OperationRequest(/*dto.doctorId, dto.patientId,*/dto.OperationTypeId, dto.DeadlineDate, dto.Priority);

            await this._repo.AddAsync(category);

            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto {
                Id = category.Id.AsGuid(), OperationTypeId = category.operationTypeId, DeadlineDate = category.deadlineDate, Priority = category.priority
                };
        }

        public async Task<OperationRequestDto> UpdateAsync(OperationRequestDto dto, UpdateType update)
        {
            var category = await this._repo.GetByIdAsync(new OperationRequestId(dto.Id)); 

            if (category == null)
                return null;

            switch (update)
            {
                case UpdateType.OPERATION_TYPE_ID:
                    category.operationTypeId = dto.OperationTypeId;
                    break;
                case UpdateType.DEADLINE_DATE:
                    category.deadlineDate = dto.DeadlineDate;
                    break;
                case UpdateType.PRIORITY:
                    category.priority = dto.Priority;
                    break;
                default:
                    throw new ArgumentException("Error: Invalid update type.");
            }

            await this._repo.UpdateAsync(category);

            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto {
                Id = category.Id.AsGuid(), OperationTypeId = category.operationTypeId, DeadlineDate = category.deadlineDate, Priority = category.priority
                };
        }

         public async Task<OperationRequestDto> DeleteAsync(OperationRequestId id)
        {
            var category = await this._repo.GetByIdAsync(id); 

            if (category == null)
                return null;   
            
            this._repo.Remove(category);
            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto {Id = category.Id.AsGuid()};
        }
    }
}