using System.Threading.Tasks;
using System.Collections.Generic;
using Domain.Shared;

namespace Domain.OperationTypes
{
    public class OperationTypeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationTypeRepository _repo;

        public OperationTypeService(IUnitOfWork unitOfWork, IOperationTypeRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<OperationTypeDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            
            List<OperationTypeDto> listDto = list.ConvertAll<OperationTypeDto>(cat => new OperationTypeDto{Id = cat.Id.AsGuid(), Description = cat.Description});

            return listDto;
        }

        public async Task<OperationTypeDto> GetByIdAsync(OperationTypeId id)
        {
            var cat = await this._repo.GetByIdAsync(id);
            
            if(cat == null)
                return null;

            return new OperationTypeDto{Id = cat.Id.AsGuid(), Description = cat.Description};
        }

        public async Task<OperationTypeDto> AddAsync(CreatingOperationTypeDto dto)
        {
            var category = new OperationType(dto.Description);

            await this._repo.AddAsync(category);

            await this._unitOfWork.CommitAsync();

            return new OperationTypeDto { Id = category.Id.AsGuid(), Description = category.Description };
        }

        public async Task<OperationTypeDto> UpdateAsync(OperationTypeDto dto)
        {
            var category = await this._repo.GetByIdAsync(new OperationTypeId(dto.Id)); 

            if (category == null)
                return null;   

            // change all field
            category.ChangeDescription(dto.Description);
            
            await this._unitOfWork.CommitAsync();

            return new OperationTypeDto { Id = category.Id.AsGuid(), Description = category.Description };
        }

        public async Task<OperationTypeDto> InactivateAsync(OperationTypeId id)
        {
            var category = await this._repo.GetByIdAsync(id); 

            if (category == null)
                return null;   

            // change all fields
            category.MarkAsInative();
            
            await this._unitOfWork.CommitAsync();

            return new OperationTypeDto { Id = category.Id.AsGuid(), Description = category.Description };
        }

         public async Task<OperationTypeDto> DeleteAsync(OperationTypeId id)
        {
            var category = await this._repo.GetByIdAsync(id); 

            if (category == null)
                return null;   

            if (category.Active)
                throw new BusinessRuleValidationException("It is not possible to delete an active category.");
            
            this._repo.Remove(category);
            await this._unitOfWork.CommitAsync();

            return new OperationTypeDto { Id = category.Id.AsGuid(), Description = category.Description };
        }
    }
}