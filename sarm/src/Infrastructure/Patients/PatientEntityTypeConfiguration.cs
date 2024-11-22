using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Patients;
using Domain.Shared;
using Google.Type;
using System;
using DDDNetCore.Domain.Patients;
using Domain.Users;
using DateTime = System.DateTime;
using PhoneNumber = Domain.Shared.PhoneNumber;

// using Domain.Shared;

namespace Infrastructure.Patients
{
    public class PatientEntityTypeConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            builder.HasKey(p => p.Id);
            
            builder.OwnsOne(p => p.FullName, name =>
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
                        v => new Name(v));
            });

            builder.Property(p => p.DateOfBirth)
                .IsRequired()
                .HasColumnName("DateOfBirth")
                .HasConversion(
                    v => v.ToString(), 
                    v => new DateOfBirth(v)
                );

            builder.Property(p => p.Gender)
                .HasColumnName("Gender")
                .IsRequired(false) // Make it optional
                .HasConversion(
                    v => v.HasValue ? GenderUtils.ToString(v.Value) : null,  // Handle null values
                    v => v != null ? GenderUtils.FromString(v) : (Gender?)null // Allow null to map correctly
                );


            builder.Property(p => p.MedicalRecordNumber)
                .HasColumnName("BloodType")
                .HasConversion(
                    v => v.Value,
                    v => new MedicalRecordNumber(v)
                );
            
            builder.OwnsOne(p=> p.ContactInformation, contact =>
            {
                contact.Property(c => c.PhoneNumber)
                    .HasColumnName("PhoneNumber")
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasConversion(
                        v => v.Value.ToString(),
                        v => new PhoneNumber(v));
                
                contact.Property(c => c.Email)
                    .HasColumnName("Email")
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasConversion(
                        v=> v.Value,
                        v=> new Email(v));
            });
            
            builder.OwnsMany(p => p.MedicalConditions, medicalConditions =>
            {
                medicalConditions.Property(m => m.Condition)
                    .HasColumnName("MedicalCondition")
                    .HasMaxLength(100)
                    .IsRequired(false);
            });
            
            builder.OwnsOne(p => p.EmergencyContact, emergencyContact =>
            {
                emergencyContact.Property(e => e.Number)
                    .HasColumnName("EmergencyContactPhoneNumber")
                    .IsRequired(false)
                    .HasConversion(
                        v => v.Value.ToString(),
                        v => new PhoneNumber(int.Parse(v)))
                    .HasMaxLength(100);
            });

            builder.Property(p => p.MedicalRecordNumber)
                .HasColumnName("MedicalRecordNumber");

            builder.OwnsMany(p => p.AppointmentHistory, history =>
            {
                history.Property(h => h.Start)
                    .HasColumnName("Start")
                    .HasConversion(
                        v => v.ToString("yyyy-MM-dd HH:mm"),
                        v => DateTime.ParseExact(v, "yyyy-MM-dd HH:mm", null)
                    );
                history.Property(h => h.End)
                    .HasColumnName("End")
                    .HasConversion(
                        v => v.ToString("yyyy-MM-dd HH:mm"),
                        v => DateTime.ParseExact(v, "yyyy-MM-dd HH:mm", null)
                    );
            });

            builder.Property(p => p.UserId)
                .HasColumnName("UserId")
                .IsRequired(false)
                .HasConversion(
                    v => v.Value.ToString(),
                    v => new UserId(Guid.Parse(v))
                );
        }
    }
}