using DDDNetCore.Domain.Specializations;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Specialization = DDDNetCore.Domain.Specializations.Specialization;

namespace DDDNetCore.Infrastructure.Specializations
{
    public class SpecializationEntityTypeConfiguration : IEntityTypeConfiguration<Specialization>
    {
        public void Configure(EntityTypeBuilder<Specialization> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.SNOMEDCTCode)
                .IsRequired()
                .HasColumnName("SNOMEDCTCode")
                .HasConversion(
                    v => v.Value,
                    v => new SNOMEDCTCode(v)
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
        }
    }
}