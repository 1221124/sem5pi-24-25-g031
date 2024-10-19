using System;

namespace Domain.Log{
        public enum LogType{
            CREATE,
            UPDATE,
            DELETE
        }

        public class LogTypeName{
            public static string ValueOf(LogType logType){
                switch(logType){
                    case LogType.CREATE:
                        return "Create";
                    case LogType.UPDATE:
                        return "Update";
                    case LogType.DELETE:
                        return "Delete";
                    default:
                        throw new ArgumentException("Invalid log type");
            }
        }
    }
}