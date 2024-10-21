namespace Domain.OperationRequests
{
    public enum RequestStatus
    {
        PENDING,
        ACCEPTED,
        REJECTED
    }

    public static class RequestStatusExtensions
    {
        public static string ToString(this RequestStatus status)
        {
            return status switch
            {
                RequestStatus.PENDING => "Pending",
                RequestStatus.ACCEPTED => "Accepted",
                RequestStatus.REJECTED => "Rejected",
                _ => string.Empty,
            };
        }
    }
}