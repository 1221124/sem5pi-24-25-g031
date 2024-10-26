
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Shared;

namespace Domain.OperationTypes
{
    public interface IOperationTypeRepository: IRepository<OperationType, OperationTypeId>
    {
        Task<OperationType> GetByNameAsync(Name name);
        Task<List<OperationType>> GetBySpecializationAsync(Specialization specialization);
        Task<List<OperationType>> GetByStatusAsync(Status status);
    }
}