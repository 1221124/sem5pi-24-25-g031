using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.Surgeries;
using DDDNetCore.Domain.SurgeryRooms;
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

            builder.Property(x => x.RequestCode)
                .IsRequired()
                .HasColumnName("RequestCode")
                .HasConversion(
                    v => v.Value,
                    v => new RequestCode(v)
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

            builder.OwnsOne(x => x.AppointmentDate, ad =>
            {
                ad.Property(x => x.Start)
                    .HasColumnName("AppointmentDatesStart")
                    .HasConversion(
                        v => v.ToString("yyyy-MM-dd HH:mm"),
                        v => DateTime.ParseExact(v, "yyyy-MM-dd HH:mm", null)
                    );

                ad.Property(x => x.End)
                    .HasColumnName("AppointmentDatesEnd")
                    .HasConversion(
                        v => v.ToString("yyyy-MM-dd HH:mm"),
                        v => DateTime.ParseExact(v, "yyyy-MM-dd HH:mm", null)
                    );
            });

            builder.OwnsMany(a => a.AssignedStaff, staff =>
            {
                staff.Property(s => s.Value)
                    .HasColumnName("LicenseNumber")
                    .IsRequired();
            });

        }
    }
}