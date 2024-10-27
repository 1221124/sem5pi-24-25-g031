using Domain.OperationTypes;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.OperationTypes
{
    public class OperationTypeEntityTypeConfiguration : IEntityTypeConfiguration<OperationType>
    {
        public void Configure(EntityTypeBuilder<OperationType> builder)
        {
            builder.HasKey(o => o.Id);

            builder.Property(o => o.Name)
                .IsRequired()
                .HasMaxLength(100)
                .HasConversion(
                    v => (string)v,
                    v => (Name)v
                );

            builder.Property(o => o.Specialization)
                .IsRequired()
                .HasMaxLength(100)
                .HasConversion(
                    v => SpecializationUtils.ToString(v),
                    v => SpecializationUtils.FromString(v)
                );

            builder.Property(o => o.RequiredStaff)
                .IsRequired()
                .HasConversion(
                    v => RequiredStaff.ToString(v),
                    v => RequiredStaff.FromString(v)
                )
                .HasColumnName("RequiredStaff");

            builder.Property(o => o.PhasesDuration)
                .IsRequired()
                .HasConversion(
                    v => (string)v,
                    v => (PhasesDuration)v
                )
                .HasColumnName("PhasesDuration");

            builder.Property(o => o.Status)
                .IsRequired()
                .HasConversion(
                    v => StatusUtils.ToString(v),
                    v => StatusUtils.FromString(v)
                )
                .HasColumnName("Status");
        }
    }
}