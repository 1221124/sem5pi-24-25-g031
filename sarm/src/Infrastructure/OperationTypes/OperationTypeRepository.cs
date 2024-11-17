using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.OperationTypes;
using Domain.Shared;
using Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.OperationTypes
{
    public class OperationTypeRepository : BaseRepository<OperationType, OperationTypeId>, IOperationTypeRepository
    {

        private DbSet<OperationType> _objs;
    
        public OperationTypeRepository(SARMDbContext context):base(context.OperationTypes)
        {
            this._objs = context.OperationTypes;
        }

        public async Task<List<OperationType>> GetAsync(string? name, string? specialization, string? status)
        {
            var operationTypes = await this._objs.AsQueryable().ToListAsync();

            if (name != null)
            {
                operationTypes = operationTypes
                    .Where(x => name.Equals(x.Name.Value))
                    .ToList();
            }

            if (specialization != null)
            {
                operationTypes = operationTypes
                    .Where(x => specialization.Equals(SpecializationUtils.ToString(x.Specialization)))
                    .ToList();
            }

            if (status != null)
            {
                operationTypes = operationTypes
                    .Where(x => status.Equals(StatusUtils.ToString(x.Status)))
                    .ToList();
            }

            return operationTypes;
        }

        public async Task<OperationType> GetByNameAsync(Name name)
        {
            return await this._objs
                .AsQueryable().Where(x => name.Equals(x.Name)).FirstOrDefaultAsync();
        }

        public async Task<List<OperationType>> GetBySpecializationAsync(Specialization specialization)
        {
            return await this._objs
                .AsQueryable().Where(x => specialization.Equals(x.Specialization)).ToListAsync();
        }

        public async Task<List<OperationType>> GetByStatusAsync(Status status)
        {
            return await this._objs
                .AsQueryable().Where(x => status.Equals(x.Status)).ToListAsync();
        }
    }
}