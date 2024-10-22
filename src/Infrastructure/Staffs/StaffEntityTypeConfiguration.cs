using System;
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
                .HasMaxLength(100);
            name.Property(n => n.LastName)
                .HasColumnName("LastName")
                .IsRequired()
                .HasMaxLength(100);
        });

        builder.OwnsOne(o => o.ContactInformation, contact =>
        {
            contact.Property(c => c.Email)
                .HasColumnName("Email")
                .IsRequired()
                .HasMaxLength(100);
            contact.Property(c => c.PhoneNumber)
                .HasColumnName("PhoneNumber")
                .IsRequired()
                .HasMaxLength(10);
        });

        builder.Property(o => o.LicenseNumber)
            .IsRequired()
            .HasMaxLength(100);

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
                    v => v.ToString("yyyy-MM-dd:HH'h'mm"),
                    v => DateTime.Parse(v)
                );
            slot.Property(s => s.End)
                .HasColumnName("End")
                .IsRequired()
                .HasConversion(
                    v => v.ToString("yyyy-MM-dd:HH'h'mm"),
                    v => DateTime.Parse(v)
                );
        });

        builder.OwnsMany(o => o.SlotAvailability, slot =>
        {
            slot.Property(s => s.Start)
                .HasColumnName("Start")
                .IsRequired()
                .HasConversion(
                    v => v.ToString("yyyy-MM-dd:HH'h'mm"),
                    v => DateTime.Parse(v)
                );
            slot.Property(s => s.End)
                .HasColumnName("End")
                .IsRequired()
                .HasConversion(
                    v => v.ToString("yyyy-MM-dd:HH'h'mm"),
                    v => DateTime.Parse(v)
                );
        });

    }
}