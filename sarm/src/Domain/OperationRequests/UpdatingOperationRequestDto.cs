namespace DDDNetCore.Domain.OperationRequests
{
    public class UpdatingOperationRequestDto
    {
        public Guid Id { get; set; }
        public DeadlineDate DeadlineDate { get; set; }
        public Priority Priority { get; set; }
        public RequestStatus RequestStatus { get; set; }

        public UpdatingOperationRequestDto(Guid id, DeadlineDate deadlineDate, Priority priority, RequestStatus requestStatus)
        {
            Id = id;
            DeadlineDate = deadlineDate;
            Priority = priority;
            RequestStatus = requestStatus;
        }
        
        public UpdatingOperationRequestDto()
        {
        }
    }
}