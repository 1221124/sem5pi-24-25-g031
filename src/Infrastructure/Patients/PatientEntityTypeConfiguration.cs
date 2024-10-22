using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Patients;
using Domain.Shared;
using Google.Type;
using DateTime = System.DateTime;
using PhoneNumber = Domain.Shared.PhoneNumber;

// using Domain.Shared;

namespace Infrastructure.Patients
{
    internal class PatientEntityTypeConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            builder.HasKey(p => p.Id);
            
            builder.OwnsOne(p => p.FullName, name =>
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

            builder.Property(p => p.DateOfBirth)
                .IsRequired()
                .HasColumnName("DateOfBirth")
                .HasConversion(
                    v => v.ToString("yyyy-MM-dd"), 
                    v => DateTime.Parse(v) 
                );

                

            builder.Property(p => p.Gender)
                .HasColumnName("Gender")
                .HasConversion(
                    v => GenderUtils.ToString(v),
                    v => GenderUtils.FromString(v)
                );
            
            /*
            builder.Property(p => p.MedicalRecordNumber)
                .HasColumnName("MedicalRecordNumber");
                
            */
            
            builder.OwnsOne(p=> p.ContactInformation, contact =>
            {
                contact.Property(c => c.PhoneNumber)
                    .HasColumnName("PhoneNumber")
                    .IsRequired()
                    .HasConversion(
                        v=> v.ToString(),
                        v=> PhoneNumber.FromString(v))
                    .HasMaxLength(100);
                contact.Property(c => c.Email)
                    .HasColumnName("Email")
                    .IsRequired()
                    .HasMaxLength(100);
            });
            
            builder.OwnsMany(p => p.MedicalConditions, medicalConditions =>
            {
                medicalConditions.Property(m => m.Condition)
                    .HasColumnName("MedicalCondition")
                    .HasMaxLength(100);
            });
            
            builder.OwnsOne(p => p.EmergencyContact, emergencyContact =>
            {
                emergencyContact.Property(e => e.Number)
                    .HasColumnName("EmergencyContactPhoneNumber")
                    .HasConversion(
                        v=> v.ToString(),
                        v=> PhoneNumber.FromString(v))
                    .HasMaxLength(100);
            });
            
            
            
            
                
        }
    }
}