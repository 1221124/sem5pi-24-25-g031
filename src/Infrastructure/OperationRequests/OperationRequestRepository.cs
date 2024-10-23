using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.OperationRequests;
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

        public async Task<List<OperationRequest>> GetByOperationType(OperationTypeId operationTypeId)
        {
            return await _objs
                .AsQueryable().Where(x => x.OperationTypeId.Equals(operationTypeId)).ToListAsync();
        }

        public async Task<List<OperationRequest>> GetByStatus(RequestStatus status)
        {
            return await _objs
                .AsQueryable().Where(x => x.Status.Equals(status)).ToListAsync();
        }

        public async Task<List<OperationRequest>> GetByPriority(Priority priority)
        {
            return await _objs
                .AsQueryable().Where(x => x.Priority.Equals(priority)).ToListAsync();
        }

        public async Task<List<OperationRequest>> GetByOperationTyped(OperationTypeId operationTypeId)
        {
            return await _objs
                .AsQueryable().Where(x => x.OperationTypeId.Equals(operationTypeId)).ToListAsync();
        }

        public Task<List<OperationRequest>> GetByStatusId(RequestStatus status)
        {
            return Task.Run(() => _objs.Where(x => x.Status.Equals(status)).ToList());
        }
    }
}