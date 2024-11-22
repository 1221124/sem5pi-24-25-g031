using DDDNetCore.Domain.OperationRequests;
using Domain.Shared;

namespace DDDNetCore.Domain.OperationRequests
{
    public interface IOperationRequestRepository : IRepository<OperationRequest, OperationRequestId>
    {
        Task<List<OperationRequest>> GetByOperationType(Name operationType);
        Task<OperationRequest> GetByCode(RequestCode code);
        Task<List<OperationRequest>> GetByStatusId(RequestStatus status);
        Task UpdateAsync(OperationRequest operationRequest);
        // Task<List<OperationRequest>> GetFilteredAsync(OperationRequestFilters filters);
    }
}