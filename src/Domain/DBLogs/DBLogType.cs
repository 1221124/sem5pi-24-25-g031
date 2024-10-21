using System;

namespace Domain.DBLogs
{
        public enum DBLogType{
            CREATE,
            UPDATE,
            DELETE,
            ERROR
        }

        public class DBLogTypeName{
            public static string ValueOf(DBLogType logType){
                switch(logType){
                    case DBLogType.CREATE:
                        return "Create";
                    case DBLogType.UPDATE:
                        return "Update";
                    case DBLogType.DELETE:
                        return "Delete";
                    case DBLogType.ERROR:
                        return "Error";
                    default:
                        throw new ArgumentException("Invalid log type");
            }
        }
    }
}