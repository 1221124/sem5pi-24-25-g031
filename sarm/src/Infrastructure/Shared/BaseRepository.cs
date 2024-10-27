using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Domain.Shared;

namespace Infrastructure.Shared
{
    public class BaseRepository<TEntity,TEntityId> : IRepository<TEntity,TEntityId>
    where TEntity : Entity<TEntityId>
    where TEntityId : EntityId
    {
        private readonly DbSet<TEntity> _objs;

        public BaseRepository(DbSet<TEntity> objs)
        {
            this._objs = objs ?? throw new ArgumentNullException(nameof(objs));
        
        }

        public async Task<List<TEntity>> GetAllAsync()
        {
            return await EntityFrameworkQueryableExtensions.ToListAsync(this._objs);
        }
        
        public async Task<TEntity> GetByIdAsync(TEntityId id)
        {
            //return await this._context.Categories.FindAsync(id);
            return await this._objs
                .AsQueryable().Where(x => id.Equals(x.Id)).FirstOrDefaultAsync();
        }
        public async Task<List<TEntity>> GetByIdsAsync(List<TEntityId> ids)
        {
            return await this._objs
                .AsQueryable().Where(x => ids.Contains(x.Id)).ToListAsync();
        }
        public async Task<TEntity> AddAsync(TEntity obj)
        {
            var ret = await this._objs.AddAsync(obj);
            return ret.Entity;
        }

        public void Remove(TEntity obj)
        {
            this._objs.Remove(obj);
        }
    }
}