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
                    .Where(x => x.Name.Value.Trim().ToLower().StartsWith(name.Trim().ToLower()))
                    .ToList();
            }

            if (specialization != null)
            {
                operationTypes = operationTypes
                    .Where(x => specialization.Trim().ToUpper().Equals(SpecializationUtils.ToString(x.Specialization).Trim().ToUpper()))
                    .ToList();
            }

            if (status != null)
            {
                operationTypes = operationTypes
                    .Where(x => status.Trim().ToLower().Equals(StatusUtils.ToString(x.Status).Trim().ToLower()))
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

        public async Task<OperationType> GetByCodeAsync(OperationTypeCode code)
        {
            return await this._objs
                .AsQueryable().Where(x => code.Equals(x.OperationTypeCode)).FirstOrDefaultAsync();
        }
    }
}