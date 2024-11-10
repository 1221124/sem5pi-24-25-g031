namespace Domain.Shared
{
    public enum Status
    {
        Active = 0,
        Inactive = 1,
        Pending = 2
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
                Status.Pending => false,
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
                case "PENDING":
                    return Status.Pending;
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
                Status.Pending => "PENDING",
                _ => throw new System.ArgumentException($"Invalid status: {status}")
            };
        }
    }
}