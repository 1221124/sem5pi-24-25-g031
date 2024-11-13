using System.Threading.Tasks;
using Domain.Shared;

namespace DDDNetCore.Tests.src.Infrastructure
{
    public class TestUnitOfWork : IUnitOfWork
    {
        private readonly TestDbContext _context;

        public TestUnitOfWork(TestDbContext context)
        {
            _context = context;
        }

        public Task<int> CommitAsync()
        {
            return _context.SaveChangesAsync();
        }
    }
}