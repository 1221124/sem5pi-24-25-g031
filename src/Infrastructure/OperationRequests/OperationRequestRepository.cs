using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.OperationRequests;
using Domain.Shared;
using Infrastructure.Shared;

namespace Infrastructure.OperationRequests
{
    public class OperationRequestRepository : BaseRepository<OperationRequest, OperationRequestId>, IOperationRequestRepository
    {
    
        public OperationRequestRepository(SARMDbContext context):base(context.OperationRequests)
        {
            throw new System.NotImplementedException();
        }

        public Task UpdateAsync(OperationRequest operationRequest)
        {
            throw new System.NotImplementedException();
        }
    }
}