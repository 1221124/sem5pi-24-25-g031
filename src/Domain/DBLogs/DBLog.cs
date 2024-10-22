using System;
using Domain.Shared;
using Domain.Users;

namespace Domain.DBLogs
{
    public class DBLog : Entity<DBLogId>, IAggregateRoot
    {
        public EntityType EntityType { get; }
        public DBLogType LogType { get; }
        public DateTime TimeStamp { get; }
        public UserId PerformedBy { get; }
        public Guid Affected { get; }
        public string Message { get; }

        public DBLog() { }
        
        public DBLog(EntityType entityType, DBLogType logType, UserId performedBy, Guid affected)
        {
            Id = new DBLogId(Guid.NewGuid());
            EntityType = entityType;
            LogType = logType;
            TimeStamp = DateTime.Now;   
            PerformedBy = performedBy;
            Affected = affected;
        }

        public DBLog(string message){
            Id = new DBLogId(Guid.NewGuid());
            LogType = DBLogType.ERROR;
            TimeStamp = DateTime.Now;
            Message = message;
        }
    }
}