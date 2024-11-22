using System;
using DDDNetCore.Domain.OperationRequests;
using Domain.OperationTypes;
using Domain.Patients;
using Domain.Staffs;
using Domain.Shared;

namespace DDDNetCore.Domain.OperationRequests
{
    public class OperationRequestDto
    {
        public Guid Id { get; set; }
        public LicenseNumber Staff { get; set; }
        public MedicalRecordNumber Patient { get; set; }
        public Name OperationType { get; set; }
        public DeadlineDate DeadlineDate { get; set; }
        public Priority Priority { get; set; }
        public RequestStatus Status {get; set;}
        public RequestCode RequestCode { get; set; }
        
        public OperationRequestDto(Guid id, LicenseNumber staff, MedicalRecordNumber patient, Name operationType, DeadlineDate deadlineDate, Priority priority, RequestStatus status, RequestCode requestCode)
        {
            Id = id;
            Staff = staff;
            Patient = patient;
            OperationType = operationType;
            DeadlineDate = deadlineDate;
            Priority = priority;
            Status = status;
            RequestCode = requestCode;
        }

        public OperationRequestDto(Guid id)
        {
            Id = id;
        }

        public OperationRequestDto()
        {
        }

    }
}