using Domain.Shared;
using Domain.Staffs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Staffs;

public class StaffEntityTypeConfiguration : IEntityTypeConfiguration<Staff>
{
    public void Configure(EntityTypeBuilder<Staff> builder)
    {
        builder.HasKey(o => o.Id);

        builder.Property(o => o.UserId)
            .IsRequired();

        builder.OwnsOne(o => o.FullName, name =>
        {
            name.Property(n => n.FirstName)
                .HasColumnName("FirstName")
                .IsRequired()
                .HasMaxLength(100)
                .HasConversion(
                    v => v.Value,
                    v => new Name(v)
                );
            name.Property(n => n.LastName)
                .HasColumnName("LastName")
                .IsRequired()
                .HasMaxLength(100)
                .HasConversion(
                    v => v.Value,
                    v => new Name(v)
                );
        });

        builder.OwnsOne(o => o.ContactInformation, contact =>
        {
            contact.Property(c => c.Email)
                .HasColumnName("Email")
                .IsRequired()
                .HasMaxLength(100)
                .HasConversion(
                    v => v.Value,
                    v => new Email(v)
                );
            contact.Property(c => c.PhoneNumber)
                .HasColumnName("PhoneNumber")
                .IsRequired()
                .HasMaxLength(10)
                .HasConversion(
                    v => v.Value.ToString(),
                    v => new PhoneNumber(int.Parse(v))
                );
            ;
        });

        builder.Property(o => o.Id.LicenseNumber)
            .HasColumnName("LicenseNumber")
            .HasMaxLength(100)
            .HasConversion(
                v => v.Value,
                v => new LicenseNumber(v)
            );

        builder.Property(o => o.Specialization)
            .IsRequired()
            .HasMaxLength(100)
            .HasConversion(
                v => SpecializationUtils.ToString(v),
                v => SpecializationUtils.FromString(v)
            );

        builder.Property(o => o.Status)
            .IsRequired()
            .HasConversion(
                v => StatusUtils.ToString(v),
                v => StatusUtils.FromString(v)
            );

        builder.OwnsMany(o => o.SlotAppointement, slot =>
        {
            slot.Property(s => s.Start)
                .HasColumnName("Start")
                .IsRequired()
                .HasConversion(
                    v => v.ToString("yyyy-MM-dd HH:mm"),
                    v => DateTime.ParseExact(v, "yyyy-MM-dd HH:mm", null)
                );

            slot.Property(s => s.End)
                .HasColumnName("End")
                .IsRequired()
                .HasConversion(
                    v => v.ToString("yyyy-MM-dd HH:mm"),
                    v => DateTime.ParseExact(v, "yyyy-MM-dd HH:mm", null)
                );
        });

        builder.OwnsMany(o => o.SlotAvailability, slot =>
        {
            slot.Property(s => s.Start)
                .HasColumnName("Start")
                .IsRequired()
                .HasConversion(
                    v => v.ToString("yyyy-MM-dd HH:mm"),
                    v => DateTime.ParseExact(v, "yyyy-MM-dd HH:mm", null)
                );

            slot.Property(s => s.End)
                .HasColumnName("End")
                .IsRequired()
                .HasConversion(
                    v => v.ToString("yyyy-MM-dd HH:mm"),
                    v => DateTime.ParseExact(v, "yyyy-MM-dd HH:mm", null)
                );
        });

    }
}