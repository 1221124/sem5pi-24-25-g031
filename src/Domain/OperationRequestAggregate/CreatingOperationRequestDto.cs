using Domain.OperationTypes;


namespace Domain.OperationRequestAggregate
{
        public class CreatingOperationRequestDto{
            public OperationTypeId OperationTypeId { get; set; }
            public DateTime DeadlineDate { get; set; }
            public Priority Priority { get; set; }
            
            public CreatingOperationRequestDto(OperationTypeId operationTypeId, DateTime deadlineDate, Priority priority)
            {
                OperationTypeId = operationTypeId;
                DeadlineDate = deadlineDate;
                Priority = priority;
        }
    }
}