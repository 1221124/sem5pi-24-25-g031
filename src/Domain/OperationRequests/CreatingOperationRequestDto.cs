using System;
using Domain.OperationTypes;
using Domain.Shared;


namespace Domain.OperationRequests
{
        public class CreatingOperationRequestDto{
            public Email StaffEmail { get; set; }
            public Email PatientEmail { get; set; }
            public Name OperationTypeName { get; set; }
            public DateTime DeadlineDate { get; set; }
            public Priority Priority { get; set; }
            public RequestStatus Status { get; set; }

        public CreatingOperationRequestDto(Email staffEmail, Email patientEmail, Name operationTypeName, DateTime deadlineDate, Priority priority, RequestStatus status)
        {
            StaffEmail = staffEmail;
            PatientEmail = patientEmail;
            OperationTypeName = operationTypeName;
            DeadlineDate = deadlineDate;
            Priority = priority;
            Status = status;
        }

        public CreatingOperationRequestDto(){}
    }
}