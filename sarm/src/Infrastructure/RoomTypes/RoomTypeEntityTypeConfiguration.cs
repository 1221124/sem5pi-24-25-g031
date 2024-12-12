using DDDNetCore.src.Domain.RoomTypes;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDNetCore.src.Infrastructure.RoomTypes {
    public class RoomTypeEntityTypeConfiguration : IEntityTypeConfiguration<RoomType>
    {
        public void Configure(EntityTypeBuilder<RoomType> builder)
        {
            builder.HasKey(x => x.Id);
            
            builder.Property(x => x.RoomTypeCode)
                .IsRequired()
                .HasColumnName("RoomTypeCode")
                .HasConversion(
                    v => v.Value,
                    v => new RoomTypeCode(v)
                );

            builder.Property(x => x.Name)
                .IsRequired()
                .HasColumnName("Name")
                .HasConversion(
                    v => v.Value,
                    v => new Name(v)
                );

            builder.Property(x => x.Description)
                .IsRequired()
                .HasColumnName("Description")
                .HasConversion(
                    v => v.Value,
                    v => new Description(v)
                );

            builder.Property(x => x.AvailableForSurgeries)
                .IsRequired()
                .HasColumnName("AvailableForSurgeries")
                .HasConversion(
                    v => v.ToString(),
                    v => bool.Parse(v)
                );
        }
    }
}