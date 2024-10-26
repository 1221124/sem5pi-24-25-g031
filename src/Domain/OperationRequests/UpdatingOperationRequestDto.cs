namespace Domain.OperationRequests
{
    public class UpdatingOperationRequestDto
    {
        public OperationRequestId Id { get; set; }
        public DateTime? DeadlineDate { get; set; }
        public Priority? Priority { get; set; }
        public RequestStatus? RequestStatus { get; set; }

        public UpdatingOperationRequestDto(OperationRequestId id, DateTime? deadlineDate, 
        Priority? priority, RequestStatus? requestStatus)
        {
            Id = id;
            DeadlineDate = deadlineDate;
            Priority = priority;
            RequestStatus = requestStatus;
        }
    }
}