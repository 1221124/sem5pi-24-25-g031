using DDDNetCore.Domain.DbLogs;
using Domain.Shared;

namespace Domain.DbLogs
{
    public class DbLog : Entity<DbLogId>, IAggregateRoot
    {
        public EntityTypeName EntityType { get; }
        public DbLogTypeName LogType { get; }
        public DateTime TimeStamp { get; }
        public Message Message { get; }

            
        public DbLog(EntityTypeName entityType, DbLogTypeName logType, Message message)
        {
            Id = new DbLogId(Guid.NewGuid());
            EntityType = entityType;
            LogType = logType;
            TimeStamp = DateTime.Now;   
            Message = message;
        }
    }
}