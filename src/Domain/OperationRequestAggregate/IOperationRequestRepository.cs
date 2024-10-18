using System.Threading.Tasks;
using Domain.Shared;

namespace Domain.OperationRequestAggregate
{
    public interface IOperationRequestRepository : IRepository<OperationRequest, OperationRequestId>
    {
        Task AddAllAsync(OperationRequest category);
        Task AddAsync(OperationRequestDto category);
        Task UpdateAsync(OperationRequestDto category);
        Task DeleteAsync(OperationRequestId id);
        Task GetTaskByIdAsync(OperationRequestId id);

        
    }
}