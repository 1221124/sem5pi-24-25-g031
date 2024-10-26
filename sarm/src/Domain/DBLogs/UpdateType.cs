namespace DBLogs{
    public enum UpdateType
    {
        PATIENT_NAME,
        PATIENT_MEDICAL_RECORD_NUMBER,
        STATUS,
        DEADLINE_DATE,
        PRIORITY,
        DATE_RANGE
    }

    public class UpdateTypeName
    {
        public static string ToString(UpdateType type)
        {
            switch (type)
            {
                case UpdateType.PATIENT_NAME:
                    return "Patient Name";
                case UpdateType.PATIENT_MEDICAL_RECORD_NUMBER:
                    return "Patient Medical Record Number";
                case UpdateType.STATUS:
                    return "Status";
                case UpdateType.DEADLINE_DATE:
                    return "Deadline Date";
                case UpdateType.PRIORITY:
                    return "Priority";
                case UpdateType.DATE_RANGE:
                    return "Date Range";
                default:
                    return "Invalid.";
            }
        }
    }
}