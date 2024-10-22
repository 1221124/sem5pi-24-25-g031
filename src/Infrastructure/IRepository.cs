using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Shared
{
    public interface IRepository<TEntity, TEntityId>
    {
        Task<List<TEntity>> GetAllAsync();
        Task<TEntity> GetByIdAsync(TEntityId id);
        Task<TEntity> AddAsync(TEntity obj);
        void Remove(TEntity obj);
    }
}