using DDDNetCore.Domain.Surgeries;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDNetCore.Infrastructure.Surgeries{
    public class SurgeryEntityTypeConfiguration : IEntityTypeConfiguration<Surgery>
    {
        public void Configure(EntityTypeBuilder<Surgery> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name)
                .IsRequired()
                .HasColumnName("SurgeryRoom")
                .HasConversion(
                    v => v.Value,
                    v => (Name) v
                );

            builder.Property(x => x.SurgeryNumber)
                .IsRequired()
                .HasColumnName("SurgeryNumber")
                .HasConversion(
                    v => v.Value,
                    v => new SurgeryNumber(v)
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
                    v => v.Capacity.ToString(),
                    v => new RoomCapacity(v)
                );
               
                
            builder.Property(x => x.AssignedEquipment)
                .IsRequired()
                .HasColumnName("AssignedEquipment")
                .HasConversion(
                    v => string.Join(",", v.Equipment),
                    v => new AssignedEquipment(v)
                );

            builder.Property(x => x.CurrentStatus)
                .IsRequired()
                .HasColumnName("CurrentStatus")
                .HasConversion(
                    v => CurrentStatusUtils.ToString(v),
                    v => CurrentStatusUtils.FromString(v)
                );

            builder.OwnsMany(p => p.MaintenanceSlots, slots =>
            {
                slots.Property(h => h.Start)
                    .HasColumnName("Start")
                    .HasConversion(
                        v => v.ToString("yyyy-MM-dd HH:mm"),
                        v => DateTime.ParseExact(v, "yyyy-MM-dd HH:mm", null)
                    );
                slots.Property(h => h.End)
                    .HasColumnName("End")
                    .HasConversion(
                        v => v.ToString("yyyy-MM-dd HH:mm"),
                        v => DateTime.ParseExact(v, "yyyy-MM-dd HH:mm", null)
                    );
            });
        }
    }
}