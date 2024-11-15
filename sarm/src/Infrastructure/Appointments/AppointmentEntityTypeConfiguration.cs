using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.Surgeries;
using Domain.OperationRequests;
using Domain.Shared;
using Domain.Staffs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDNetCore.Infrastructure.Appointments{
    public class AppointmentEntityTypeConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.ToTable("Appointments");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .HasColumnName("Id");

            builder.Property(x => x.Staff)
                .IsRequired()
                .HasColumnName("Staff")
                .HasConversion(
                    v => v.ToString(),
                    v => new LicenseNumber(v)
                );

            builder.Property(x => x.Priority)
                .IsRequired()
                .HasColumnName("Priority")
                .HasConversion(
                    v => PriorityUtils.ToString(v),
                    v => PriorityUtils.FromString(v)
                );

            builder.Property(x => x.OperationType)
                .IsRequired()
                .HasColumnName("OperationType")
                .HasMaxLength(100)
                .HasConversion(
                    v => v.Value,
                    v => new Name(v)
                );
            
            builder.Property(x => x.SurgeryNumber)
                .IsRequired()
                .HasColumnName("SurgeryNumber")
                .HasConversion(
                    v => v.ToString(),
                    v => new SurgeryNumber(v)                    
                );

            builder.Property(x => x.AppointmentDate)
                .IsRequired()
                .HasColumnName("AppointmentDate")
                .HasConversion(
                    v => v.Date,
                    v => new AppointmentDate(v)
                );
            
        }
    }
}