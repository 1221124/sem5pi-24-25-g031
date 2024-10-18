using System.Threading.Tasks;
using System.Collections.Generic;
using Domain.Shared;
using Domain.OperationRequestAggregate;

namespace Domain.OperationRequestAggregate
{
    public class OperationRequestService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationRequestRepository _repo;

        public OperationRequestService(IUnitOfWork unitOfWork, IOperationRequestRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<OperationRequestDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            
            List<OperationRequestDto> listDto = list.ConvertAll<OperationRequestDto>(cat => new OperationRequestDto{});

            return listDto;
        }
        public async Task<OperationRequestDto> AddAsync(CreatingOperationRequestDto dto)
        {
            var category = new OperationRequestDto(dto.OperationTypeId, dto.DeadlineDate, dto.Priority);

            await this._repo.AddAsync(category);

            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto {id = category.Id.AsGuid(), operationTypeId = category.operationTypeId, deadlineDate = category.deadlineDate, priority = category.priority};
        }

        public async Task<OperationRequestDto> UpdateAsync(OperationRequestDto dto)
        {
            var category = await this._repo.GetByIdAsync(new OperationRequestId(dto.id)); 

            if (category == null)
                return null;   

            // change all field
            
            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto {id = category.Id.AsGuid(), operationTypeId = category.operationTypeId, deadlineDate = category.deadlineDate, priority = category.priority};
        }

         public async Task<OperationRequestDto> DeleteAsync(OperationRequestId id)
        {
            var category = await this._repo.GetByIdAsync(id); 

            if (category == null)
                return null;   

            // if (category.Active)
            //     throw new BusinessRuleValidationException("It is not possible to delete an active category.");
            
            this._repo.Remove(category);
            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto {id = category.Id.AsGuid()};
        }
    }
}