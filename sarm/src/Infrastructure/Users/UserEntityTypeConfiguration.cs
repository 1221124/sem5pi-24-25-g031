using Domain.Users;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Users
{
    public class UserEntityTypeConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(u => u.Id);

            builder.OwnsOne(u => u.Username, username =>
            {
                username.Property(n => n.Value)
                    .HasColumnName("Username")
                    .IsRequired()
                    .HasMaxLength(100);
            });

            builder.OwnsOne(u => u.Email, email =>
            {
                email.Property(e => e.Value)
                    .HasColumnName("Email")
                    .IsRequired()
                    .HasMaxLength(100);
            });

            builder.Property(u => u.Role)
                .IsRequired()
                .HasConversion(
                    v => RoleUtils.ToString(v),
                    v => RoleUtils.FromString(v)
                );

            builder.Property(u => u.UserStatus)
                .IsRequired()
                .HasConversion(
                    v => UserStatusUtils.ToString(v),
                    v => UserStatusUtils.FromString(v)
                )
                .HasColumnName("UserStatus");
        }
    }
}
