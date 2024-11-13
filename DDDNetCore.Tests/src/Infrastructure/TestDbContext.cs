using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace DDDNetCore.Tests.src.Infrastructure
{
    public class TestDbContext : SARMDbContext
    {
        public TestDbContext(DbContextOptions<TestDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}