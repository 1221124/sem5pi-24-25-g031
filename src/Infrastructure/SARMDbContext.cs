using Microsoft.EntityFrameworkCore;

using Domain.OperationTypes;
using Domain.OperationRequestAggregate;

using Infrastructure.OperationTypes;
using Infrastructure.OperationRequestAggregate;
using Infrastructure.Users;
using Domain.Users;

namespace Infrastructure
{
    public class SARMDbContext : DbContext
    {
        public DbSet<OperationType> OperationTypes { get; set; }
        public DbSet<OperationRequest> OperationRequests { get; set; }
        public DbSet<User> Users { get; set; }

        public SARMDbContext (DbContextOptions options) : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new OperationTypeEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new OperationRequestEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new UserEntityTypeConfiguration());
        }
    }
}