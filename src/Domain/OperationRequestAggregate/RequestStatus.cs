namespace Domain.OperationRequestAggregate
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
            switch (status)
            {
                case RequestStatus.PENDING:
                    return "Pending";
                case RequestStatus.ACCEPTED:
                    return "Accepted";
                case RequestStatus.REJECTED:
                    return "Rejected";
                default:
                    return string.Empty;
            }
        }
    }
}