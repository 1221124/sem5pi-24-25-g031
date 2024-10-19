using System.Threading.Tasks;
using Domain.Shared;

namespace Domain.OperationRequestAggregate
{
    public interface IOperationRequestRepository : IRepository<OperationRequest, OperationRequestId>
    {
        Task AddAllAsync(OperationRequest category);
        new Task AddAsync(OperationRequest category);
        Task UpdateAsync(OperationRequest category);
        Task DeleteAsync(OperationRequestId id);
        Task GetTaskByIdAsync(OperationRequestId id);
    }
}