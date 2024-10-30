namespace Domain.DbLogs
{
    public enum DbLogType
    {
        Create,
        Update,
        Delete,
        Error
    }

    public class DbLogTypeName
    {
        public string Value { get; }
        
        public DbLogTypeName(DbLogType value)
        {
            Value = ValueOf(value);
        }
        
        public DbLogTypeName(string value)
        {
            Value = value;
        }
        
        public static string ValueOf(DbLogType logType)
        {
            switch (logType)
            {
                case DbLogType.Create:
                    return "Create";
                case DbLogType.Update:
                    return "Update";
                case DbLogType.Delete:
                    return "Delete";
                case DbLogType.Error:
                    return "Error";
                default:
                    throw new ArgumentException("Invalid log type");
            }
        }
    }
}