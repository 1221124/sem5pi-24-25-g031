using Domain.OperationRequestAggregate;
using Infrastructure.Shared;

namespace Infrastructure.OperationRequestAggregate
{
    public class OperationRequestRepository : BaseRepository<OperationRequest, OperationRequestId>, IOperationRequestRepository
    {
    
        public OperationRequestRepository(SARMDbContext context):base(context.OperationRequests)
        {

        }


    }
}