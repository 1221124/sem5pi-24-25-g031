using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.OperationRequests;
using System;

namespace Infrastructure.OperationRequests
{
    internal class OperationRequestEntityTypeConfiguration : IEntityTypeConfiguration<OperationRequest>
    {
        public void Configure(EntityTypeBuilder<OperationRequest> builder)
        {           
            builder.HasKey(b => b.Id);

            builder.Property(p => p.PatientId)
                .IsRequired()
                .HasColumnName("PatientId");

            builder.Property(p => p.DoctorId)
                .IsRequired()
                .HasColumnName("StaffId");

            builder.Property(p => p.OperationTypeId)
                .IsRequired()
                .HasColumnName("OperationTypeId");

            builder.Property(p => p.DeadlineDate)
                .IsRequired()
                .HasColumnName("DeadlineDate")
                .HasConversion(
                    v => v.ToString("yyyy-MM-dd"),
                    v => DateTime.Parse(v)
                );

            builder.Property(p => p.Priority)
                .IsRequired()
                .HasColumnName("Priority")
                .HasConversion(
                    v => PriorityUtils.ToString(v),
                    v => PriorityUtils.FromString(v)
                );
            
            builder.Property(p => p.Status)
                .IsRequired()
                .HasColumnName("Status")
                .HasConversion(
                    v => RequestStatusUtils.ToString(v),
                    v => RequestStatusUtils.FromString(v)
                );
        }
    }
}