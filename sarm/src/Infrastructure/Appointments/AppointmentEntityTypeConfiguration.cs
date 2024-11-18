using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.Surgeries;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.OperationRequests;
using Domain.Shared;
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

            builder.Property(x => x.OperationRequestId)
                .IsRequired()
                .HasColumnName("OperationRequestId")
                .HasConversion(
                    v => v.Value,
                    v => new OperationRequestId(v)
                );
            
            builder.Property(x => x.SurgeryRoomNumber)
                .IsRequired()
                .HasColumnName("SurgeryNumber")
                .HasConversion(
                    v => SurgeryRoomNumberUtils.ToString(v),
                    v => SurgeryRoomNumberUtils.FromString(v)                    
                );
            
            builder.Property(x => x.AppointmentNumber)
                .IsRequired()
                .HasColumnName("AppointmentNumber")
                .HasConversion(
                    v => v.Value,
                    v => new AppointmentNumber(v)
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