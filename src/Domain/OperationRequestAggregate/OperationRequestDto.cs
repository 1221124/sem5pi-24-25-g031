using System;
using Domain.OperationTypes;
using Domain.Shared;

namespace Domain.OperationRequestAggregate
{
    public class OperationRequestDto : Entity<OperationRequestId>, IAggregateRoot
    {
        public Guid id { get; set; }

        /*public PatientId patientId { get; set; }

        public DoctorId doctorId { get; set; }*/

        public OperationTypeId operationTypeId { get; set; }
        public DateTime deadlineDate { get; set; }
        public Priority priority { get; set; }
        
        
        public OperationRequestDto(OperationRequestId id, /*PatientId patientId, DoctorId doctorId,*/ OperationTypeId operationTypeId, DateTime deadlineDate, Priority priority)
        {
            this.id = id.AsGuid();
            /*this.patientId = patientId;
            this.doctorId = doctorId;*/
            this.operationTypeId = operationTypeId;
            this.deadlineDate = deadlineDate;
            this.priority = priority;
        }

        public OperationRequestDto(/*PatientId patientId, DoctorId doctorId,*/ OperationTypeId operationTypeId, DateTime deadlineDate, Priority priority)
        {
            /*this.patientId = patientId;
            this.doctorId = doctorId;*/
            this.operationTypeId = operationTypeId;
            this.deadlineDate = deadlineDate;
            this.priority = priority;
        }

        public OperationRequestDto()
        {
        }
    }
}