using DDDNetCore.Domain.DbLogs;
using Domain.DbLogs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace Infrastructure.DbLogs
{
    public class DbLogEntityTypeConfiguration : IEntityTypeConfiguration<DbLog>
    {
        public void Configure(EntityTypeBuilder<DbLog> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.EntityType)
                .IsRequired()
                .HasColumnName("EntityType");

            builder.Property(p => p.LogType)
                .IsRequired()
                .HasColumnName("LogType");


            builder.Property(p => p.Affected)
                .HasColumnName("Affected");

            builder.Property(p => p.Message)
                .IsRequired()
                .HasColumnName("Message")
                .HasConversion(
                    v => v.Value,
                    v => new Message(v)
                    )
                ;
        }
    }
}