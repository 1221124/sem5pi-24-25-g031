using System;
using Domain.OperationTypes;
using Domain.Patients;
using Domain.Staffs;
using Domain.Shared;

namespace Domain.OperationRequests
{
    public class OperationRequestDto
    {
        public Guid Id { get; set; }
        // public PatientId PatientId { get; set; }
        // public StaffId DoctorId { get; set; }
        // public OperationTypeId OperationTypeId { get; set; }
        public LicenseNumber Staff { get; set; }
        public MedicalRecordNumber Patient { get; set; }
        public Name OperationType { get; set; }
        public DeadlineDate DeadlineDate { get; set; }
        public Priority Priority { get; set; }
        public RequestStatus Status {get; set;}
        
        // public OperationRequestDto(Guid id, PatientId patientId, StaffId doctorId, OperationTypeId operationTypeId, DeadlineDate deadlineDate, Priority priority, RequestStatus status)
        // {
        //     Id = id;
        //     PatientId = patientId;
        //     DoctorId = doctorId;
        //     OperationTypeId = operationTypeId;
        //     DeadlineDate = deadlineDate;
        //     Priority = priority;
        //     Status = status;
        // }

        // public OperationRequestDto(Guid id)
        // {
        //     Id = id;
        // }

        // public OperationRequestDto()
        // {
        // }

        public OperationRequestDto(Guid id, LicenseNumber staff, MedicalRecordNumber patient, Name operationType, DeadlineDate deadlineDate, Priority priority, RequestStatus status)
        {
            Id = id;
            Staff = staff;
            Patient = patient;
            OperationType = operationType;
            DeadlineDate = deadlineDate;
            Priority = priority;
            Status = status;
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