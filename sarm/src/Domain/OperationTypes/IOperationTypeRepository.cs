
using Domain.Shared;

namespace Domain.OperationTypes
{
    public interface IOperationTypeRepository: IRepository<OperationType, OperationTypeId>
    {
        Task<OperationType> GetByCodeAsync(OperationTypeCode operationTypeCode);
        Task<List<OperationType>> GetAsync(string? name, string? specialization, string? status);
        Task<OperationType> GetByNameAsync(Name name);
        Task<List<OperationType>> GetBySpecializationAsync(Specialization specialization);
        Task<List<OperationType>> GetByStatusAsync(Status status);
    }
}