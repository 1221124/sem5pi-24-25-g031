using DDDNetCore.Domain.OperationRequests;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Shared;
using Domain.Patients;
using Domain.Staffs;

namespace DDDNetCore.Infrastructure.OperationRequests
{
    public class OperationRequestEntityTypeConfiguration : IEntityTypeConfiguration<OperationRequest>
    {
        public void Configure(EntityTypeBuilder<OperationRequest> builder)
        {
            builder.HasKey(o => o.Id);

            builder.Property(o => o.RequestCode)
                .IsRequired()
                .HasColumnName("RequestCode")
                .HasConversion(
                    v => v.Value,
                    v => new RequestCode(v)
                );
            
            builder.Property(o => o.Staff)
                .IsRequired()
                .HasColumnName("Staff")
                .HasConversion(
                    v => v.Value,
                    v => new LicenseNumber(v)
                );
            
            builder.Property(o => o.Patient)
                .IsRequired()
                .HasColumnName("Patient")
                .HasConversion(
                    v => v.Value,
                    v => new MedicalRecordNumber(v)
                );
            
            builder.Property(o => o.OperationType)
                .IsRequired()
                .HasColumnName("OperationType")
                .HasConversion(
                    v => v.Value,
                    v => new Name(v)
                );
            
            builder.Property(o => o.DeadlineDate)
                .IsRequired()
                .HasColumnName("DeadlineDate")
                .HasConversion(
                    v => v.Date,
                    v => new DeadlineDate(v)
                );
            
            builder.Property(o => o.Priority)
                .IsRequired()
                .HasColumnName("Priority")
                .HasConversion(
                    v => PriorityUtils.ToString(v),
                    v => PriorityUtils.FromString(v)
                );
            
            builder.Property(o => o.Status)
                .IsRequired()
                .HasColumnName("RequestStatus")
                .HasConversion(
                    v => RequestStatusUtils.ToString(v),
                    v => RequestStatusUtils.FromString(v)
                );
        }
    }
}