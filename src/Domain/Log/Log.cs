using System;

namespace Domain.Log
{
    public class Log
    {
        public LogId Id { get; }
        public EntityType EntityType { get; }
        public LogType LogType { get; }
        public DateTime TimeStamp { get; }
        /*public UserId PerformedBy { get; }*/

        public Log(LogId id, EntityType entityType, LogType logType, DateTime timeStamp/*, UserId performedBy*/)
        {
            Id = id;
            EntityType = entityType;
            LogType = logType;
            TimeStamp = timeStamp;
            /*PerformedBy = performedBy;*/
        }
    }
}