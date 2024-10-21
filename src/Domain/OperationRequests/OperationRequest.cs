using System;
using Domain.Shared;
using Domain.OperationTypes;
using Domain.Patients;
using Domain.Staff;
using Azure;

namespace Domain.OperationRequests
{
    public class OperationRequest : Entity<OperationRequestId>, IAggregateRoot
    {
        public PatientId PatientId { get; set; }

        public StaffId DoctorId { get; set; }

        public OperationTypeId OperationTypeId { get; set; }
        public DateTime DeadlineDate { get; set; }
        public Priority Priority { get; set; }
        public RequestStatus Status {get; set;}
        
        
        public OperationRequest(PatientId patientId, StaffId doctorId, OperationTypeId operationTypeId, DateTime deadlineDate, Priority priority, RequestStatus status)
        {
            Id = new OperationRequestId(Guid.NewGuid());
            PatientId = patientId;
            DoctorId = doctorId;
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