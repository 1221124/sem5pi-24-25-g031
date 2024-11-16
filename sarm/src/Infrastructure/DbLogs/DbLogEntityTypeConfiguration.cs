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
            builder.ToTable("DbLogs");
            
            builder.HasKey(p => p.Id);

            builder.Property(p => p.EntityType)
                .IsRequired()
                .HasColumnName("EntityType")
                .HasConversion(
                    v => v.Value,
                    v => new EntityTypeName(v)
                    )
                ;

            builder.Property(p => p.LogType)
                .IsRequired()
                .HasColumnName("LogType")
                .HasConversion(
                    v => v.Value,
                    v => new DbLogTypeName(v)
                    )
                ;

            builder.Property(p => p.TimeStamp)
                .IsRequired()
                .HasColumnName("TimeStamp")
                .HasConversion(
                    v => v.ToString("yyyy-MM-dd HH:mm:ss"), 
                    v => DateTime.Parse(v) 
                    )
                ;

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