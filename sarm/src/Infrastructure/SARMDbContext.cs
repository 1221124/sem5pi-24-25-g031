using DDDNetCore.Domain.Patients;
using DDDNetCore.Infrastructure.OperationRequests;
using Domain.DbLogs;
using Microsoft.EntityFrameworkCore;

using Domain.OperationTypes;

using Infrastructure.OperationTypes;
using Infrastructure.Users;
using Domain.Users;
using Infrastructure.Patients;
using Domain.Staffs;
using Infrastructure.Staffs;
using Infrastructure.DbLogs;
using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.SurgeryRooms;
using DDDNetCore.Infrastructure.Appointments;
using DDDNetCore.Infrastructure.SurgeryRooms;

namespace Infrastructure
{
    public class SARMDbContext : DbContext
    {
        public DbSet<DbLog> DbLogs { get; set; }
        public DbSet<OperationType> OperationTypes { get; set; }
        public DbSet<OperationRequest> OperationRequests { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<DbLog> Logs { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<SurgeryRoom> SurgeryRooms { get; set; }

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
            modelBuilder.ApplyConfiguration(new StaffEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new DbLogEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new AppointmentEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new SurgeryRoomEntityTypeConfiguration());
        }
    }
}