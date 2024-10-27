using Domain.Shared;
using Domain.UsersSession;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.UsersSession
{
    public class UsersSessionEntityTypeConfiguration : IEntityTypeConfiguration<UserSession>
    {
        public void Configure(EntityTypeBuilder<UserSession> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.UserId)
                .HasColumnName("UserId")
                .IsRequired();

            builder.OwnsOne(u => u.Email, email =>
            {
                email.Property(e => e.Value)
                    .HasColumnName("Email")
                    .IsRequired()
                    .HasMaxLength(100);
            });

            builder.Property(x => x.Role)
                .HasColumnName("Role")
                .IsRequired()
                .HasConversion(
                    v => RoleUtils.ToString(v),
                    v => RoleUtils.FromString(v)
                    );

            builder.Property(x => x.ExpiresIn)
                .HasColumnName("ExpiresIn")
                .HasColumnType("datetime2")
                .IsRequired();

            builder.Property(x => x.IdToken)
                .HasColumnName("IdToken")
                .IsRequired()
                .HasColumnType("nvarchar(max)");
        }
    }
}