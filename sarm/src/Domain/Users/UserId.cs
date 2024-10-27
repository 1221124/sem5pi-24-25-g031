using System;
using Domain.Shared;

namespace Domain.Users
{

    public class UserId : EntityId
    {
        public UserId(Guid value) : base(value)
        {
        }

        public UserId(string value) : base(value)
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