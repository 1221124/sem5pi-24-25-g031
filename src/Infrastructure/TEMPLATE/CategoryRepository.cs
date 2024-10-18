using Domain.OperationTypes;
using Infrastructure.Shared;

namespace Infrastructure.TEMPLATE
{
    public class OperationTypeRepository : BaseRepository<OperationType, OperationTypeId>, IOperationTypeRepository
    {
    
        public OperationTypeRepository(SARMDbContext context):base(context.OperationTypes)
        {
           
        }


    }
}