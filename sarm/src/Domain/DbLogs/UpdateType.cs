namespace Domain.DbLogs
{
    public enum UpdateType
    {
        PatientName,
        PatientMedicalRecordNumber,
        Status,
        DeadlineDate,
        Priority,
        DateRange
    }

    public class UpdateTypeName
    {
        public static string ToString(UpdateType type)
        {
            switch (type)
            {
                case UpdateType.PatientName:
                    return "Patient Name";
                case UpdateType.PatientMedicalRecordNumber:
                    return "Patient Medical Record Number";
                case UpdateType.Status:
                    return "Status";
                case UpdateType.DeadlineDate:
                    return "Deadline Date";
                case UpdateType.Priority:
                    return "Priority";
                case UpdateType.DateRange:
                    return "Date Range";
                default:
                    return "Invalid.";
            }
        }
    }
}