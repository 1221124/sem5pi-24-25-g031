using System;
using Domain.OperationTypes;
using Domain.Shared;

namespace Domain.OperationRequestAggregate
{
    public class OperationRequestDto : Entity<OperationRequestId>, IAggregateRoot
    {
        public new Guid Id { get; set; }

        /*public PatientId patientId { get; set; }

        public UserId userId { get; set; }*/

        public OperationTypeId OperationTypeId { get; set; }
        public DateTime DeadlineDate { get; set; }
        public Priority Priority { get; set; }
        
        public OperationRequestDto(OperationRequestId id, /*PatientId patientId, DoctorId doctorId,*/ OperationTypeId operationTypeId, DateTime deadlineDate, Priority priority)
        {
            Id = id.AsGuid();
            /*this.patientId = patientId;
            this.doctorId = doctorId;*/
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate;
            Priority = priority;
        }

        public OperationRequestDto(OperationRequestId id)
        {
            Id = id.AsGuid();
        }

        public OperationRequestDto()
        {
        }
    }
}