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
                RequestStatus.PENDING => "Pending",
                RequestStatus.ACCEPTED => "Accepted",
                RequestStatus.REJECTED => "Rejected",
                _ => string.Empty,
            };
        }

        public static RequestStatus FromString(this string status)
        {
            return status switch{
                "Pending" => RequestStatus.PENDING,
                "Accepted" => RequestStatus.ACCEPTED,
                "Rejected" => RequestStatus.REJECTED,
                _ => throw new ArgumentException("Invalid request status value")
            };
        }
    }
}