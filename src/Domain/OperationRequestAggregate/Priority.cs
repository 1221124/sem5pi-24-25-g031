namespace Domain.OperationRequestAggregate
{
    public enum Priority
    {
        ELECTIVE,
        URGENT,
        EMERGENCY
    }

    public static class PriorityExtensions
    {
        public static string ToString(this Priority priority)
        {
            switch (priority)
            {
                case Priority.ELECTIVE:
                    return "Elective";
                case Priority.URGENT:
                    return "Urgent";
                case Priority.EMERGENCY:
                    return "Emergency";
                default:
                    return string.Empty;
            }
        }
    }
}