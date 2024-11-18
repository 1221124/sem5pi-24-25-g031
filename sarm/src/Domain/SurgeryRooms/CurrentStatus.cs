namespace DDDNetCore.Domain.Surgeries
{
    public enum CurrentStatus
    {
        AVAILABLE,
        OCUPIED,
        UNDER_MAINTEINANCE
    }

    public class CurrentStatusUtils
    {
        public static string ToString(CurrentStatus status)
        {
            switch (status)
            {
                case CurrentStatus.AVAILABLE:
                    return "Available";
                case CurrentStatus.OCUPIED:
                    return "Ocupied";
                case CurrentStatus.UNDER_MAINTEINANCE:
                    return "Under Maintenance";
                default:
                    return "Unknown";
            }
        }

        public static CurrentStatus FromString(string status)
        {
            switch (status)
            {
                case "Available":
                    return CurrentStatus.AVAILABLE;
                case "Ocupied":
                    return CurrentStatus.OCUPIED;
                case "Under Maintenance":
                    return CurrentStatus.UNDER_MAINTEINANCE;
                default:
                    return CurrentStatus.AVAILABLE;
            }
        }
    }
}