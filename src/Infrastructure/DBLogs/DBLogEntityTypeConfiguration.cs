using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.DBLogs;


namespace Infrastructure.DBLogs
{
    internal class DBLogEntityTypeConfiguration : IEntityTypeConfiguration<DBLog>
    {
        public void Configure(EntityTypeBuilder<DBLog> builder)
        {
            // cf. https://www.entityframeworktutorial.net/efcore/fluent-api-in-entity-framework-core.aspx
            
            //builder.ToTable("OperationType", SchemaNames.DDDSample1);
            builder.HasKey(b => b.Id);
            //builder.Property<bool>("_active").HasColumnName("Active");
        }
    }
}