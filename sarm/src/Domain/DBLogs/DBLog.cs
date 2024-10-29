using DDDNetCore.Domain.DBLogs;
using Domain.DBLogs;
using Domain.Shared;

namespace Domain.DbLogs
{
    public class DbLog : Entity<DbLogId>, IAggregateRoot
    {
        public EntityType EntityType { get; }
        public DbLogType LogType { get; }
        public DateTime TimeStamp { get; }
        public Guid? Affected { get; }
        public Message Message { get; }

            
        public DbLog(EntityType entityType, DbLogType logType, Message message)
        {
            Id = new DbLogId(Guid.NewGuid());
            EntityType = entityType;
            LogType = logType;
            TimeStamp = DateTime.Now;   
            Message = message;
        }

        public DbLog(EntityType entityType, DbLogType logType, Guid affected, Message message){
            Id = new DbLogId(Guid.NewGuid());
            EntityType = entityType;
            LogType = logType;
            Affected = affected;
            TimeStamp = DateTime.Now;
            Message = message;
        }
    }
}