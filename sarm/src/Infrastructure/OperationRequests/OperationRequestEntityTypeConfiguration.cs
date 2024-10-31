using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.OperationRequests;
using Domain.Shared;

namespace DDDNetCore.Infrastructure.OperationRequests
{
    public class OperationRequestEntityTypeConfiguration : IEntityTypeConfiguration<OperationRequest>
    {
        public void Configure(EntityTypeBuilder<OperationRequest> builder)
        {
            builder.HasKey(o => o.Id);
            
            builder.Property(o => o.DoctorId)
                .IsRequired()
                .HasColumnName("StaffId");
            
            builder.Property(o => o.PatientId)
                .IsRequired()
                .HasColumnName("PatientId");
            
            builder.Property(o => o.OperationTypeId)
                .IsRequired()
                .HasColumnName("OperationTypeId");
            
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