using System;
using Domain.OperationTypes;
using Domain.Shared;


namespace Domain.OperationRequests
{
        public class CreatingOperationRequestDto{
            public string Id { get; set; }
            public string OperationRequestId { get; set; }
            public string StaffId { get; set; }
            public string PatientId { get; set; }
            public string OperationTypeId { get; set; }
            public string DeadlineDate { get; set; }
            public string Priority { get; set; }
            public string Status { get; set; }

        public CreatingOperationRequestDto(string id, string staffId, string patientId, string operationTypeId, string deadlineDate, string priority, string status)
        {
            Id = id;
            StaffId = staffId;
            PatientId = patientId;
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate;
            Priority = priority;
            Status = status;
        }

        public CreatingOperationRequestDto(string staffId, string patientId, string operationTypeId, string deadlineDate, string priority, string status)
        {
            StaffId = staffId;
            PatientId = patientId;
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate;
            Priority = priority;
            Status = status;
        }
    }
}