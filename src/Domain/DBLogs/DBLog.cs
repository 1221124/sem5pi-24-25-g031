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
        public Guid EntityId { get; }
        public string Message { get; }

        public DBLog(EntityType entityType, DBLogType logType, DateTime timeStamp, UserId performedBy, Guid entityId)
        {
            Id = new DBLogId(Guid.NewGuid());
            EntityType = entityType;
            LogType = logType;
            TimeStamp = timeStamp;
            PerformedBy = performedBy;
            EntityId = entityId;
        }

        public DBLog(string message){
            Id = new DBLogId(Guid.NewGuid());
            LogType = DBLogType.ERROR;
            TimeStamp = DateTime.Now;
            Message = message;
        }
    }
}