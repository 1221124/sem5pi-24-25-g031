using System;
using Domain.OperationTypes;
using Domain.Shared;


namespace Domain.OperationRequestAggregate
{
        public class CreatingOperationRequestDto{
            public Guid Id { get; set; }
            // public StaffId StaffId { get; set; }
            // public PatientId PatientId { get; set; }
            public DateTime DeadlineDate { get; set; }
            public Priority Priority { get; set; }
            
            public CreatingOperationRequestDto(Guid id, /*StaffId staffId, PatientId patientId*/DateTime deadlineDate, Priority priority, Status status)
            {
                Id = id;
                // StaffId = staffId;
                // PatientId = patientId;
                DeadlineDate = deadlineDate;
                Priority = priority;
        }

        public CreatingOperationRequestDto(Guid id, DateTime deadlineDate, Priority priority)
        {
            Id = id;
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