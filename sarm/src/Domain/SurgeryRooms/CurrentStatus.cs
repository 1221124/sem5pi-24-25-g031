namespace DDDNetCore.Domain.Surgeries
{
    public enum CurrentStatus
    {
        AVAILABLE,
        OCCUPIED,
        UNDER_MAINTENANCE
    }

    public class CurrentStatusUtils
    {
        public static string ToString(CurrentStatus status)
        {
            switch (status)
            {
                case CurrentStatus.AVAILABLE:
                    return "Available";
                case CurrentStatus.OCCUPIED:
                    return "Occupied";
                case CurrentStatus.UNDER_MAINTENANCE:
                    return "Under Maintenance";
                default:
                    return "Unknown";
            }
        }

        public static CurrentStatus FromString(string status)
        {
            switch (status.ToLower())
            {
                case "available":
                    return CurrentStatus.AVAILABLE;
                case "occupied":
                    return CurrentStatus.OCCUPIED;
                case "under maintenance":
                    return CurrentStatus.UNDER_MAINTENANCE;
                default:
                    return CurrentStatus.AVAILABLE;
            }
        }
    }
}