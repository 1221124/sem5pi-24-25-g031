namespace DDDNetCore.Domain.OperationRequests
{
    public enum Priority
    {
        ELECTIVE,
        URGENT,
        EMERGENCY
    }

    public static class PriorityUtils
    {
        public static string ToString(this Priority priority)
        {
            return priority switch
            {
                Priority.ELECTIVE => "elective",
                Priority.URGENT => "urgent",
                Priority.EMERGENCY => "emergency",
                _ => string.Empty
            };
        }

        public static Priority FromString(this string priority)
        {
            return priority.ToLower() switch
            {
                "elective" => Priority.ELECTIVE,
                "urgent" => Priority.URGENT,
                "emergency" => Priority.EMERGENCY,
                _ => throw new ArgumentException("Invalid priority value")
            };
        }

        public static bool Equals(Priority priority1, Priority priority2)
        {
            return priority1.ToString() == priority2.ToString();
        }
    }
}