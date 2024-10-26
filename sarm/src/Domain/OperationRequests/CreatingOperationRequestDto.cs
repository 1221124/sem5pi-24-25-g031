using System;
using Domain.OperationTypes;
using Domain.Patients;
using Domain.Shared;
using Domain.Staffs;


namespace Domain.OperationRequests
{
        public class CreatingOperationRequestDto{
            public StaffId StaffId { get; set; }
            public PatientId PatientId { get; set; }
            public OperationTypeId OperationTypeId { get; set; }
            public DeadlineDate DeadlineDate { get; set; }
            public Priority Priority { get; set; }

        public CreatingOperationRequestDto(StaffId staffId, PatientId patientId, OperationTypeId operationTypeId, DeadlineDate deadlineDate, Priority priority)
        {
            StaffId = staffId;
            PatientId = patientId;
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate;
            Priority = priority;
        }
    }
}