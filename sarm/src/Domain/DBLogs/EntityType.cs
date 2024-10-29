using System;

namespace Domain.DBLogs
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
        public static string Get(EntityType entityType)
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