namespace Domain.OperationRequests
{
    public enum RequestStatus
    {
        PENDING,
        ACCEPTED,
        REJECTED
    }

    public static class RequestStatusUtils
    {
        public static string ToString(this RequestStatus status)
        {
            return status switch
            {
                RequestStatus.PENDING => "pending",
                RequestStatus.ACCEPTED => "accepted",
                RequestStatus.REJECTED => "rejected",
                _ => string.Empty,
            };
        }

        public static RequestStatus FromString(this string status)
        {
            return status.ToLower() switch{
                "pending" => RequestStatus.PENDING,
                "accepted" => RequestStatus.ACCEPTED,
                "rejected" => RequestStatus.REJECTED,
                _ => throw new ArgumentException("Invalid request status value")
            };
        }
    }
}