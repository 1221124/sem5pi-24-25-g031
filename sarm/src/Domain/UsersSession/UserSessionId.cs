using System;
using Domain.Shared;

namespace Domain.UsersSession
{

    public class UserSessionId : EntityId
    {
        public UserSessionId(Guid value) : base(value)
        {
        }

        public UserSessionId(string value) : base(value)
        {
        }

        override
        protected object createFromString(string text)
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