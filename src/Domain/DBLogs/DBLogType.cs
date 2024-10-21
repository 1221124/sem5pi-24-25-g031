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
                    case LogType.CREATE:
                        return "Create";
                    case LogType.UPDATE:
                        return "Update";
                    case LogType.DELETE:
                        return "Delete";
                    case LogType.ERROR:
                        return "Error";
                    default:
                        throw new ArgumentException("Invalid log type");
            }
        }
    }
}