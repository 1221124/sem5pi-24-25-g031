using System.Threading.Tasks;
using DDDNetCore.Domain.OperationRequests;
using Domain.OperationTypes;
using Domain.Shared;
using Infrastructure.Shared;

namespace Domain.OperationRequests
{
    public interface IOperationRequestRepository : IRepository<OperationRequest, OperationRequestId>
    {
        Task<List<OperationRequest>> GetByOperationType(Name operationType);
        Task<List<OperationRequest>> GetByStatusId(RequestStatus status);
        Task UpdateAsync(OperationRequest operationRequest);
    }
}