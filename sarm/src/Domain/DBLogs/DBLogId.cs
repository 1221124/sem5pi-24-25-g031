using System;
using Domain.Shared;

namespace Domain.DBLogs
{
    public class DBLogId : EntityId
    {
        public DBLogId(Guid value) : base(value)
        {
        }

        public DBLogId(string value) : base(value)
        {
        }

        override
        public object createFromString(string text)
        {
            return new Guid(text);
        }

        override
        public string AsString()
        {
            Guid obj = (Guid)base.ObjValue;
            return obj.ToString();
        }

        public Guid AsGuid()
        {
            return (Guid)base.ObjValue;
        }
    }
}