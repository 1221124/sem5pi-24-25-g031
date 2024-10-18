using Microsoft.EntityFrameworkCore;

using Domain.OperationTypes;
using Domain.OperationRequestAggregate;

using Infrastructure.OperationTypes;
using Infrastructure.OperationRequestAggregate;

namespace Infrastructure
{
    public class SARMDbContext : DbContext
    {
        public DbSet<OperationType> OperationTypes { get; set; }
        public DbSet<OperationRequest> OperationRequests { get; set; }

        public SARMDbContext (DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new OperationTypeEntityTypeConfiguration());
        }
    }
}