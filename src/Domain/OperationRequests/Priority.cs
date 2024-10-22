using System;

namespace Domain.OperationRequests
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
                Priority.ELECTIVE => "Elective",
                Priority.URGENT => "Urgent",
                Priority.EMERGENCY => "Emergency",
                _ => string.Empty
            };
        }

        public static Priority FromString(this string priority)
        {
            return priority switch
            {
                "Elective" => Priority.ELECTIVE,
                "Urgent" => Priority.URGENT,
                "Emergency" => Priority.EMERGENCY,
                _ => throw new ArgumentException("Invalid priority value")
            };
        }
    }
}