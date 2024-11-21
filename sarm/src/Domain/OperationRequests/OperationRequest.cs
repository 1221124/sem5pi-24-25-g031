using Domain.OperationRequests;
using Domain.Shared;
using Domain.Patients;
using Domain.Staffs;


namespace DDDNetCore.Domain.OperationRequests
{
    public class OperationRequest : Entity<OperationRequestId>, IAggregateRoot
    {
        public LicenseNumber Staff { get; set; }
        public MedicalRecordNumber Patient { get; set; }
        public Name OperationType { get; set; }
        public DeadlineDate DeadlineDate { get; set; }
        public Priority Priority { get; set; }
        public RequestStatus Status {get; set;}

        public OperationRequest(LicenseNumber doctorId, MedicalRecordNumber patientId, Name operationTypeId, DeadlineDate deadlineDate, Priority priority)
        {
            Id = new OperationRequestId(Guid.NewGuid());
            Staff = doctorId;
            Patient = patientId;
            OperationType = operationTypeId;
            DeadlineDate = deadlineDate;
            Priority = priority;
            Status = RequestStatus.PENDING;
        }

        public OperationRequest(Guid id, LicenseNumber doctorId, MedicalRecordNumber patientId, Name operationTypeId, DeadlineDate deadlineDate, Priority priority, RequestStatus status)
        {
            Id = new OperationRequestId(id);
            Staff = doctorId;
            Patient = patientId;
            OperationType = operationTypeId;
            DeadlineDate = deadlineDate;
            Priority = priority;
            Status = status;
        }
        
        public OperationRequest(OperationRequestId id, LicenseNumber doctorId, MedicalRecordNumber patientId, Name operationTypeId, DeadlineDate deadlineDate, Priority priority, RequestStatus status)
        {
            Id = id;
            Staff = doctorId;
            Patient = patientId;
            OperationType = operationTypeId;
            DeadlineDate = deadlineDate;
            Priority = priority;
            Status = status;
        }

        public OperationRequest(Guid id, LicenseNumber doctorId, MedicalRecordNumber patientId, Name operationTypeId, DeadlineDate? deadlineDate, Priority? priority, RequestStatus? status)
        {
            Id = new OperationRequestId(id);
            Staff = doctorId;
            Patient = patientId;
            OperationType = operationTypeId;
            DeadlineDate = deadlineDate ?? throw new ArgumentNullException(nameof(deadlineDate));
            Priority = priority ?? throw new ArgumentNullException(nameof(priority));
            Status = status ?? throw new ArgumentNullException(nameof(status));
        }

        public OperationRequest Update(OperationRequest newOperationRequest)
        {
            if(newOperationRequest.DeadlineDate != null)
                DeadlineDate = newOperationRequest.DeadlineDate;

            if (newOperationRequest.Priority != null)
                Priority = newOperationRequest.Priority;

            if (newOperationRequest.Status != null)
                Status = newOperationRequest.Status;

            return this;
        }

        public OperationRequest(){}

    }
}