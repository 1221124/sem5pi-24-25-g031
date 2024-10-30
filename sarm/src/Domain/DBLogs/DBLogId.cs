using System.Text.Json.Serialization;
using Domain.Shared;

namespace Domain.DbLogs
{
    public class DbLogId : EntityId
    {
        //public new Guid Value => (Guid)base.ObjValue;
        
        [JsonConstructor]
        public DbLogId(Guid value) : base(value)
        {
        }

        public DbLogId(string value) : base(value)
        {
        }

        public DbLogId() : base(Guid.NewGuid())
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