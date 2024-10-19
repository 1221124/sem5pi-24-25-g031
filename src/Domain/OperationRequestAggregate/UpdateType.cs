namespace Log{
    public enum UpdateType
    {
        OPERATION_TYPE_ID,
        DEADLINE_DATE,
        PRIORITY
    }

    public class UpdateTypeName
    {
        public static string GetName(UpdateType type)
        {
            switch (type)
            {
                case UpdateType.OPERATION_TYPE_ID:
                    return "Operation Type Id";
                case UpdateType.DEADLINE_DATE:
                    return "Deadline Date";
                case UpdateType.PRIORITY:
                    return "Priority";
                default:
                    return "Invalid.";
            }
        }
    }
}