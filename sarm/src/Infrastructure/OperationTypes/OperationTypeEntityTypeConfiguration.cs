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

            builder.Property(o => o.OperationTypeCode)
                .IsRequired()
                .HasConversion(
                    v => v.Value,
                    v => new OperationTypeCode(v)
                )
                .HasColumnName("OperationTypeCode");

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

            builder.OwnsMany(o => o.RequiredStaff, staff =>
            {
                staff.Property(s => s.Role)
                    .HasColumnName("Role")
                    .HasConversion(
                        v => RoleUtils.ToString(v),
                        v => RoleUtils.FromString(v)
                    );

                staff.Property(s => s.Specialization)
                    .HasColumnName("Specialization")
                    .HasConversion(
                        v => SpecializationUtils.ToString(v),
                        v => SpecializationUtils.FromString(v)
                    );

                staff.Property(s => s.Quantity)
                    .HasColumnName("Quantity")
                    .HasConversion(
                        v => v.Value,
                        v => new Quantity(v)
                    );
                
                staff.Property(s => s.IsRequiredInPreparation)
                    .HasColumnName("IsRequiredInPreparation")
                    .HasConversion(
                        v => v.ToString(),
                        v => bool.Parse(v)
                    );

                staff.Property(s => s.IsRequiredInSurgery)
                    .HasColumnName("IsRequiredInSurgery")
                    .HasConversion(
                        v => v.ToString(),
                        v => bool.Parse(v)
                    );

                staff.Property(s => s.IsRequiredInCleaning)
                    .HasColumnName("IsRequiredInCleaning")
                    .HasConversion(
                        v => v.ToString(),
                        v => bool.Parse(v)
                    );
            });

            builder.OwnsOne(o => o.PhasesDuration, pd =>
            {
                pd.Property(p => p.Preparation)
                    .HasColumnName("Preparation")
                    .IsRequired()
                    .HasConversion(
                        v => v.Value,
                        v => new Quantity(v)
                );
                pd.Property(p => p.Surgery)
                    .HasColumnName("Surgery")
                    .IsRequired()
                    .HasConversion(
                        v => v.Value,
                        v => new Quantity(v)
                );
                pd.Property(p => p.Cleaning)
                    .HasColumnName("Cleaning")
                    .IsRequired()
                    .HasConversion(
                        v => v.Value,
                        v => new Quantity(v)
                );
            });

            builder.Property(o => o.Status)
                .IsRequired()
                .HasConversion(
                    v => StatusUtils.ToString(v),
                    v => StatusUtils.FromString(v)
                )
                .HasColumnName("Status");

            builder.Property(o => o.Version)
                .IsRequired()
                .HasConversion(
                    v => v.Value,
                    v => new Domain.Shared.Version(v)
                )
                .HasColumnName("Version");
        }
    }
}