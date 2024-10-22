using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.DBLogs;


namespace Infrastructure.DBLogs
{
    internal class DBLogEntityTypeConfiguration : IEntityTypeConfiguration<DBLog>
    {
        public void Configure(EntityTypeBuilder<DBLog> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(p => p.EntityType)
                .IsRequired()
                .HasColumnName("EntityType");

            builder.Property(p => p.LogType)
                .IsRequired()
                .HasColumnName("LogType");

            builder.Property(p => p.PerformedBy)
                .HasColumnName("PerformedBy");
            
            builder.Property(p => p.Affected)
                .HasColumnName("Affected");

            builder.Property(p => p.Message)
                .HasColumnName("Message");
        }
    }
}