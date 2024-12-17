using DDDNetCore.src.Domain.RoomTypes;
using Domain.Shared;
using Infrastructure;
using Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDNetCore.src.Infrastructure.RoomTypes
{
    public class RoomTypeRepository : BaseRepository<RoomType, RoomTypeId>, IRoomTypeRepository
    {
        private DbSet<RoomType> _objs; 
        
        public RoomTypeRepository(SARMDbContext context) : base(context.RoomTypes)
        {
            this._objs = context.RoomTypes;
        }

        public Task<RoomType> GetByCodeAsync(RoomTypeCode roomTypeCode)
        {
            return _objs.FirstOrDefaultAsync<RoomType>(x => x.RoomTypeCode == roomTypeCode);
        }

        public Task<List<RoomType>> GetByNameAsync(Name name)
        {
            return _objs.Where(x => x.Name == name).ToListAsync();
        }

        public async Task<string?> GetLastCodeAsync()
        {
            var last = await _objs
                .AsQueryable()
                .OrderByDescending(x => x.RoomTypeCode)
                .FirstOrDefaultAsync();

            return last?.RoomTypeCode;
        }

    }
}