using Microsoft.EntityFrameworkCore;
using Domain.OperationTypes;
using Infrastructure.OperationTypes;

namespace Infrastructure
{
    public class SARMDbContext : DbContext
    {
        public DbSet<OperationType> OperationTypes { get; set; }

        public SARMDbContext (DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new OperationTypeEntityTypeConfiguration());
        }
    }
}