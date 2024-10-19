
using System;

namespace Domain.Log
{
    public enum EntityType{
        USER,
        PATIENT,
        STAFF,
        OPERATION_REQUEST,
        OPERATION_TYPE,
        APPOINTMENT,
        SURGERY_ROOM
    }

    public class EntityTypeName{
        public static string Get(EntityType entityType){
            switch(entityType){
                case EntityType.USER:
                    return "User";
                case EntityType.PATIENT:
                    return "Patient";
                case EntityType.STAFF:
                    return "Staff";
                case EntityType.OPERATION_REQUEST:
                    return "Operation Request";
                case EntityType.OPERATION_TYPE:
                    return "Operation Type";
                case EntityType.APPOINTMENT:
                    return "Appointment";
                case EntityType.SURGERY_ROOM:
                    return "Surgery Room";
                default:
                    throw new ArgumentException("Invalid entity type");
            }
        }
    }
}