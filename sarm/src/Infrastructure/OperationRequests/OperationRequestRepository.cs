using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Domain.OperationRequests;
using Domain.OperationTypes;
using Domain.Shared;
using Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.OperationRequests
{
    public class OperationRequestRepository : BaseRepository<OperationRequest, OperationRequestId>, IOperationRequestRepository
    {

        private DbSet<OperationRequest> _objs; 
        
        public OperationRequestRepository(SARMDbContext context):base(context.OperationRequests)
        {
            this._objs = context.OperationRequests;
        }

        public Task UpdateAsync(OperationRequest operationRequest)
        {
            return Task.Run(() => _objs.Update(operationRequest));
        }
        

        public async Task<List<OperationRequest>> GetByStatusId(RequestStatus status)
        {
            return await _objs
                .AsQueryable().Where(x => x.Status.Equals(status)).ToListAsync();
        }

        public async Task<OperationRequest> GetByCode(RequestCode code)
        {
            return await _objs
                .AsQueryable().FirstOrDefaultAsync(x => x.RequestCode.Equals(code));
        }

        public async Task<List<OperationRequest>> GetByPriority(Priority priority)
        {
            return await _objs
                .AsQueryable().Where(x => x.Priority.Equals(priority)).ToListAsync();
        }

        public async Task<List<OperationRequest>> GetByOperationType(Name operationType)
        {
            return await _objs
                .AsQueryable().Where(x => x.OperationType.Equals(operationType)).ToListAsync();
        }
    }
}