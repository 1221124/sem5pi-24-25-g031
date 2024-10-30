namespace Domain.DbLogs
{
    public enum EntityType
    {
        User,
        Patient,
        Staff,
        OperationRequest,
        OperationType,
        Appointment,
        SurgeryRoom,
        Log
    }

    public class EntityTypeName
    {
        public string Value { get; }

        public EntityTypeName(EntityType value)
        {
            Value = ValueOf(value);
        }
        
        public EntityTypeName(string value)
        {
            Value = value;
        }

        public static string ValueOf(EntityType entityType)
        {
            switch (entityType)
            {
                case EntityType.User:
                    return "User";
                case EntityType.Patient:
                    return "Patient";
                case EntityType.Staff:
                    return "Staff";
                case EntityType.OperationRequest:
                    return "Operation Request";
                case EntityType.OperationType:
                    return "Operation Type";
                case EntityType.Appointment:
                    return "Appointment";
                case EntityType.SurgeryRoom:
                    return "Surgery Room";
                case EntityType.Log:
                    return "Log";
                default:
                    throw new ArgumentException("Invalid entity type");
            }
        }
    }
}