using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.OperationTypes;
// using Domain.Shared;

namespace Infrastructure.OperationTypes
{
    internal class OperationTypeEntityTypeConfiguration : IEntityTypeConfiguration<OperationType>
    {
        public void Configure(EntityTypeBuilder<OperationType> builder)
        {
            // cf. https://www.entityframeworktutorial.net/efcore/fluent-api-in-entity-framework-core.aspx
            
            // builder.ToTable("OperationType", SchemaNames.g031);
            builder.HasKey(b => b.Id);
            // builder.Property<Status>("Status").HasColumnName("Active").IsRequired();
        }
    }
}