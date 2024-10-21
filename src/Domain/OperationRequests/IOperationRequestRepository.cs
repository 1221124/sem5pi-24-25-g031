using System.Threading.Tasks;
using Domain.Shared;

namespace Domain.OperationRequests
{
    public interface IOperationRequestRepository : IRepository<OperationRequest, OperationRequestId>
    {
        //update
        Task UpdateAsync(OperationRequest operationRequest);
    }
}