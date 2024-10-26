using System;
using Domain.Shared;
using Domain.OperationTypes;
using Domain.Patients;
using Domain.Staffs;
using Azure;

namespace Domain.OperationRequests
{
    public class OperationRequest : Entity<OperationRequestId>, IAggregateRoot
    {
        private DateTime? deadlineDate;
        private Priority? priority;
        private RequestStatus? requestStatus;

        public StaffId DoctorId { get; set; }
        public PatientId PatientId { get; set; }
        public OperationTypeId OperationTypeId { get; set; }
        public DateTime DeadlineDate { get; set; }
        public Priority Priority { get; set; }
        public RequestStatus Status {get; set;}

        public OperationRequest(StaffId doctorId, PatientId patientId, OperationTypeId operationTypeId, DateTime deadlineDate, Priority priority)
        {
            Id = new OperationRequestId(Guid.NewGuid());
            DoctorId = doctorId;
            PatientId = patientId;
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate;
            Priority = priority;
            Status = RequestStatus.PENDING;
        }
        
        public OperationRequest(StaffId doctorId, PatientId patientId, OperationTypeId operationTypeId, DateTime deadlineDate, Priority priority, RequestStatus status)
        {
            Id = new OperationRequestId(Guid.NewGuid());
            DoctorId = doctorId;
            PatientId = patientId;
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate;
            Priority = priority;
            Status = status;
        }

        public OperationRequest(Guid id, StaffId doctorId, PatientId patientId, OperationTypeId operationTypeId, DateTime deadlineDate, Priority priority, RequestStatus status)
        {
            Id = new OperationRequestId(id);
            DoctorId = doctorId;
            PatientId = patientId;
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate;
            Priority = priority;
            Status = status;
        }

        public OperationRequest(OperationRequestId id, StaffId staffId, PatientId patientId, OperationTypeId operationTypeId, DateTime dateTime, Priority priority)
        {
            Id = id;
            DoctorId = staffId;
            PatientId = patientId;
            OperationTypeId = operationTypeId;
            DeadlineDate = dateTime;
            Priority = priority;
        }

        public OperationRequest(Guid id, StaffId doctorId, PatientId patientId, OperationTypeId operationTypeId, DateTime? deadlineDate, Priority? priority, RequestStatus? status)
        {
            Id = id;
            DoctorId = doctorId;
            PatientId = patientId;
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate ?? throw new ArgumentNullException(nameof(deadlineDate));
            Priority = priority ?? throw new ArgumentNullException(nameof(priority));
            Status = status ?? throw new ArgumentNullException(nameof(status));
        }

        internal void ChangeDeadlineDate(DateTime deadlineDate)
        {
            if(DeadlineDate != deadlineDate)
                DeadlineDate = deadlineDate;
        }

        internal void ChangePriority(Priority priority){
            if(Priority != priority)
                Priority = priority;
        }

        internal void ChangeStatus(RequestStatus status){
            if(Status != status)
                Status = status;
        }
    }
}