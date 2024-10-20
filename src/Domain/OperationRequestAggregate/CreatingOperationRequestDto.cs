using System;
using Domain.OperationTypes;
using Domain.Shared;


namespace Domain.OperationRequestAggregate
{
        public class CreatingOperationRequestDto{
            public OperationTypeId OperationTypeId { get; set; }
            // public StaffId StaffId { get; set; }
            // public PatientId PatientId { get; set; }
            public DateTime DeadlineDate { get; set; }
            public Priority Priority { get; set; }
            
            public CreatingOperationRequestDto(OperationTypeId operationTypeId, /*StaffId staffId, PatientId patientId*/DateTime deadlineDate, Priority priority, Status status)
            {
                OperationTypeId = operationTypeId;
                // StaffId = staffId;
                // PatientId = patientId;
                DeadlineDate = deadlineDate;
                Priority = priority;
        }

        public CreatingOperationRequestDto(OperationTypeId operationTypeId, DateTime deadlineDate, Priority priority)
        {
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate;
            Priority = priority;
        }


        //     public CreatingOperationRequestDto(OperationTypeId operationTypeId, DateTime deadlineDate, Priority priority)
        //     {
        //         OperationTypeId = operationTypeId;
        //         DeadlineDate = deadlineDate;
        //         Priority = priority;
        //     }
    }
}