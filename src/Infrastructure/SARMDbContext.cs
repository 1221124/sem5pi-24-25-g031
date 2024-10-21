using Microsoft.EntityFrameworkCore;

using Domain.OperationTypes;
using Domain.OperationRequestAggregate;
using Domain.Patients;

using Infrastructure.OperationTypes;
using Infrastructure.OperationRequestAggregate;
using Infrastructure.Users;
using Domain.Users;
using Infrastructure.Patients;
using Domain.Staff;

namespace Infrastructure
{
    public class SARMDbContext : DbContext
    {
        public DbSet<OperationType> OperationTypes { get; set; }
        public DbSet<OperationRequest> OperationRequests { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Staff> Staffs { get; set; }

        public SARMDbContext(DbContextOptions options) : base(options)
        {

        }

        // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        // {
        //     if (!optionsBuilder.IsConfigured)
        //     {
        //         optionsBuilder.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"))
        //     }
        // }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new OperationTypeEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new OperationRequestEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new UserEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new PatientEntityTypeConfiguration());
        }
    }
}