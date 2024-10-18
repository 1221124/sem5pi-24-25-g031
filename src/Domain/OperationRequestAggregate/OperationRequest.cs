using System;
using Domain.Shared;
using Domain.OperationTypes;

namespace Domain.OperationRequestAggregate
{
    public class OperationRequest : Entity<OperationRequestId>, IAggregateRoot
    {
        public Guid id { get; set; }

        /*public PatientId patientId { get; set; }

        public StaffId doctorId { get; set; }*/

        public OperationTypeId operationTypeId { get; set; }
        public DateTime deadlineDate { get; set; }
        public Priority priority { get; set; }
        
        
        public OperationRequest(/*PatientId patientId, DoctorId doctorId,*/ OperationTypeId operationTypeId, DateTime deadlineDate, Priority priority)
        {
            /*this.patientId = patientId;
            this.doctorId = doctorId;*/
            this.operationTypeId = operationTypeId;
            this.deadlineDate = deadlineDate;
            this.priority = priority;
        }
    }
}