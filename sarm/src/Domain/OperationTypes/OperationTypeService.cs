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
            
            List<OperationTypeDto> listDto = OperationTypeMapper.ToDtoList(list);

            return listDto;
        }

        public async Task<OperationTypeDto> GetByNameAsync(Name name)
        {
            var operationType = await this._repo.GetByNameAsync(name);
            
            if(operationType == null)
                return null;

            return OperationTypeMapper.ToDto(operationType);
        }

        public async Task<List<OperationTypeDto>> GetBySpecializationAsync(Specialization specialization)
        {
            var list = await this._repo.GetBySpecializationAsync(specialization);
            
            List<OperationTypeDto> listDto = OperationTypeMapper.ToDtoList(list);

            return listDto;
        }

        public async Task<List<OperationTypeDto>> GetByStatusAsync(Status status)
        {
            var list = await this._repo.GetByStatusAsync(status);
            
            List<OperationTypeDto> listDto = OperationTypeMapper.ToDtoList(list);

            return listDto;
        }

        public async Task<OperationTypeDto> GetByIdAsync(OperationTypeId id)
        {
            var operationType = await this._repo.GetByIdAsync(id);
            
            if(operationType == null)
                return null;

            return OperationTypeMapper.ToDto(operationType);
        }

        public async Task<OperationTypeDto> AddAsync(CreatingOperationTypeDto dto)
        {
            var operationType = OperationTypeMapper.ToEntityFromCreating(dto);

            if (await this._repo.GetByNameAsync(operationType.Name) != null)
                return null;

            await this._repo.AddAsync(operationType);

            await this._unitOfWork.CommitAsync();

            return OperationTypeMapper.ToDto(operationType);
        }

        public async Task<OperationTypeDto> UpdateAsync(OperationTypeDto dto)
        {
            var operationType = await this._repo.GetByIdAsync(new OperationTypeId(dto.Id));

            if (operationType == null)
                return null;   

            operationType.Name = dto.Name;
            operationType.Specialization = dto.Specialization;
            operationType.RequiredStaff = dto.RequiredStaff;
            operationType.PhasesDuration = dto.PhasesDuration;

            // OperationType opType = (OperationType) operationType;

            // opType.Name = dto.Name;
            // opType.Specialization = dto.Specialization;
            // opType._requiredStaff = dto._requiredStaff;
            // opType.PhasesDuration = dto.PhasesDuration;

            // await this._unitOfWork.CommitAsync();

            // return OperationTypeMapper.ToDto(opType);

            await this._unitOfWork.CommitAsync();

            return OperationTypeMapper.ToDto(operationType);
        }   

        public async Task<OperationTypeDto> InactivateAsync(OperationTypeId id)
        {
            var operationType = await this._repo.GetByIdAsync(id); 

            if (operationType == null)
                return null;   

            operationType.Status = Status.Inactive;
            
            await this._unitOfWork.CommitAsync();

            return OperationTypeMapper.ToDto(operationType);
        }

         public async Task<OperationTypeDto> DeleteAsync(OperationTypeId id)
        {
            var operationType = await this._repo.GetByIdAsync(id); 

            if (operationType == null)
                return null;   

            // if (operationType.Status == Status.Active)
            //     throw new BusinessRuleValidationException("It is not possible to delete an active operation type.");
            
            this._repo.Remove(operationType);
            await this._unitOfWork.CommitAsync();

            return OperationTypeMapper.ToDto(operationType);
        }
    }
}