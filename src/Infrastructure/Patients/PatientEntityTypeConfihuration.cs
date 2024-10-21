using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Patients;
// using Domain.Shared;

namespace Infrastructure.Patients
{
    internal class PatientEntityTypeConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            // cf. https://www.entityframeworktutorial.net/efcore/fluent-api-in-entity-framework-core.aspx
            
            // builder.ToTable("OperationType", SchemaNames.g031);
            builder.HasKey(b => b.Id);
            // builder.Property<Status>("Status").HasColumnName("Active").IsRequired();
        }
    }
}