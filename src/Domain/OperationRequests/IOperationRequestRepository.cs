using System.Threading.Tasks;
using Domain.OperationTypes;
using Domain.Shared;

namespace Domain.OperationRequests
{
    public interface IOperationRequestRepository : IRepository<OperationRequest, OperationRequestId>
    {
        Task<List<OperationRequest>> GetByOperationType(OperationTypeId operationTypeId);
        Task<List<OperationRequest>> GetByStatusId(RequestStatus status);
        Task UpdateAsync(OperationRequest operationRequest);
    }
}