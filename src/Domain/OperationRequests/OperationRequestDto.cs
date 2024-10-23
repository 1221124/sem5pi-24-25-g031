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

        public PatientId PatientId { get; set; }

        public StaffId DoctorId { get; set; }

        public OperationTypeId OperationTypeId { get; set; }
        public DateTime DeadlineDate { get; set; }
        public Priority Priority { get; set; }
        public RequestStatus Status {get; set;}
        
        public OperationRequestDto(Guid id, PatientId patientId, StaffId doctorId, OperationTypeId operationTypeId, DateTime deadlineDate, Priority priority)
        {
            Id = id;
            PatientId = patientId;
            DoctorId = doctorId;
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate;
            Priority = priority;
        }

        public OperationRequestDto(Guid id)
        {
            Id = id;
        }

    }
}