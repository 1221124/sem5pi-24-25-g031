using DDDNetCore.Domain.Surgeries;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDNetCore.Infrastructure.SurgeryRooms{
    public class SurgeryRoomEntityTypeConfiguration : IEntityTypeConfiguration<SurgeryRoom>
    {
        public void Configure(EntityTypeBuilder<SurgeryRoom> builder)
        {
            builder.HasKey(x => x.Id);
            
            builder.Property(x => x.SurgeryRoomNumber)
                .IsRequired()
                .HasColumnName("SurgeryRoomNumber")
                .HasConversion(
                    v => SurgeryRoomNumberUtils.ToString(v),
                    v => SurgeryRoomNumberUtils.FromString(v)
                );

            builder.Property(x => x.RoomType)
                .IsRequired()
                .HasColumnName("RoomType")
                .HasConversion(
                    v => RoomTypeUtils.ToString(v),
                    v => RoomTypeUtils.FromString(v)
                );
            
            builder.Property(x => x.RoomCapacity)
                .IsRequired()
                .HasColumnName("RoomCapacity")
                .HasConversion(
                    v => v.ToString(),
                    v => new RoomCapacity(v)
                );
            
            builder.Property(x => x.AssignedEquipment)
                .IsRequired()
                .HasColumnName("AssignedEquipment")
                .HasConversion(
                    v => v.ToString(),
                    v => new AssignedEquipment(v)
                );

            builder.Property(x => x.CurrentStatus)
                .IsRequired()
                .HasColumnName("CurrentStatus")
                .HasConversion(
                    v => CurrentStatusUtils.ToString(v),
                    v => CurrentStatusUtils.FromString(v)
                );

            builder.OwnsMany(o => o.MaintenanceSlots, slot =>
            {
                slot.Property(s => s.Start)
                    .HasColumnName("Start")
                    .HasConversion(
                        v => v.ToString("yyyy-MM-dd HH:mm"),
                        v => DateTime.ParseExact(v, "yyyy-MM-dd HH:mm", null)
                    );

                slot.Property(s => s.End)
                    .HasColumnName("End")
                    .HasConversion(
                        v => v.ToString("yyyy-MM-dd HH:mm"),
                        v => DateTime.ParseExact(v, "yyyy-MM-dd HH:mm", null)
                    );
            });
        }
    }
}