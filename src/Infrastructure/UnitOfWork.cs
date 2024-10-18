using System.Threading.Tasks;
using Domain.Shared;

namespace Infrastructure
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly SARMDbContext _context;

        public UnitOfWork(SARMDbContext context)
        {
            this._context = context;
        }

        public async Task<int> CommitAsync()
        {
            return await this._context.SaveChangesAsync();
        }
    }
}