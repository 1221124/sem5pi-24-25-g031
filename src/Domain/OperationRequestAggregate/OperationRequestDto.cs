using System;
using Domain.OperationTypes;
using Domain.Shared;

namespace Domain.OperationRequestAggregate
{
    public class OperationRequestDto : Entity<OperationRequestId>, IAggregateRoot
    {
        public new Guid Id { get; set; }

        /*public PatientId patientId { get; set; }

        public DoctorId doctorId { get; set; }*/

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

        // public OperationRequestDto(OperationRequestId is, OperationTypeId this.operationTypeId, this.deadlineDate, this.priority)
        // {
        //     this.id = id.AsGuid();
        //     this.operationTypeId = operationTypeId;
        //     this.deadlineDate = deadlineDate;
        //     this.priority = priority;
        // }

        public OperationRequestDto(Guid guid)
        {
            Id = guid;
        }

        public OperationRequestDto()
        {
        }
    }
}