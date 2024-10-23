namespace Domain.Shared
{
    public enum Status
    {
        Active,
        Inactive,
        Pending
    }

    public static class StatusUtils
    {
        public static bool IsActive(this Status status)
        {
            return status == Status.Active;
        }

        public static bool IsInactive(this Status status)
        {
            return status == Status.Inactive;
        }

        public static bool GetStatus(this Status status)
        {
            return status switch
            {
                Status.Active => true,
                Status.Inactive => false,
                _ => throw new System.ArgumentException($"Invalid status: {status}")
            };
        }

        public static Status FromString(string status)
        {
            switch (status.ToUpper())
            {
                case "ACTIVE":
                    return Status.Active;
                case "INACTIVE":
                    return Status.Inactive;
                default:
                    throw new System.ArgumentException($"Invalid status: {status}");
            }
        }

        public static string ToString(Status status)
        {
            return status switch
            {
                Status.Active => "ACTIVE",
                Status.Inactive => "INACTIVE",
                _ => throw new System.ArgumentException($"Invalid status: {status}")
            };
        }
    }
}