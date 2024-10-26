using System;
using Domain.OperationTypes;
using Domain.Shared;


namespace Domain.OperationRequests
{
        public class CreatingOperationRequestDto{
            public EmailDto StaffEmail { get; set; }
            public EmailDto PatientEmail { get; set; }
            public NameDto OperationTypeName { get; set; }
            public DateTime DeadlineDate { get; set; }
            public Priority Priority { get; set; }

        public CreatingOperationRequestDto(EmailDto staffEmail, EmailDto patientEmail, NameDto operationTypeName, DateTime deadlineDate, Priority priority)
        {
            StaffEmail = staffEmail;
            PatientEmail = patientEmail;
            OperationTypeName = operationTypeName;
            DeadlineDate = deadlineDate;
            Priority = priority;
        }
    }

    public class EmailDto
    {
        public required string Value { get; set; }
    }

    public class NameDto
    {
        public required string Value { get; set; }
    }
}