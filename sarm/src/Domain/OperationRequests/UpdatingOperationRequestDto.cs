namespace Domain.OperationRequests
{
    public class UpdatingOperationRequestDto
    {
        public Guid Id { get; set; }
        public DeadlineDate? DeadlineDate { get; set; }
        public Priority? Priority { get; set; }
        public RequestStatus? RequestStatus { get; set; }

        public UpdatingOperationRequestDto(Guid id, DeadlineDate? deadlineDate, 
        Priority? priority, RequestStatus? requestStatus)
        {
            Id = id;
            DeadlineDate = deadlineDate ?? null;
            Priority = priority ?? null;
            RequestStatus = requestStatus ?? null;
        }
        
        public UpdatingOperationRequestDto(Guid id, RequestStatus? requestStatus)
        {
            Id = id;
            DeadlineDate = null;
            Priority =  null;
            RequestStatus = requestStatus ?? null;
        }
        
        public UpdatingOperationRequestDto(Guid id, DeadlineDate? deadlineDate)
        {
            Id = id;
            DeadlineDate = deadlineDate ?? null;
            Priority = null;
            RequestStatus = null;
        }
        
        public UpdatingOperationRequestDto(Guid id, Priority? priority)
        {
            Id = id;
            DeadlineDate = null;
            Priority = priority ?? null;
            RequestStatus = null;
        }
        
        public UpdatingOperationRequestDto()
        {
        }
    }
}