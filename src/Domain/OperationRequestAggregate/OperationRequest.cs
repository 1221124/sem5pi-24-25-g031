using System;
using Domain.Shared;
using Domain.OperationTypes;

namespace Domain.OperationRequestAggregate
{
    public class OperationRequest : Entity<OperationRequestId>, IAggregateRoot
    {
        public OperationRequestId OperationRequestId { get; set; }

        /*public PatientId PatientId { get; set; }

        public StaffId DoctorId { get; set; }*/

        public OperationTypeId OperationTypeId { get; set; }
        public DateTime DeadlineDate { get; set; }
        public Priority Priority { get; set; }
        public RequestStatus Status {get; set;}
        
        
        public OperationRequest(OperationRequestId id, /*PatientId patientId, DoctorId doctorId,*/ OperationTypeId operationTypeId, DateTime deadlineDate, Priority priority, RequestStatus status)
        {
            OperationRequestId = id;
            /*PatientId = patientId;
            DoctorId = doctorId;*/
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate;
            Priority = priority;
            Status = status;
        }

        public OperationRequest(OperationTypeId operationTypeId, DateTime deadlineDate, Priority priority, RequestStatus status)
        {
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate;
            Priority = priority;
            Status = status;
        }
    }
}