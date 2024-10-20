using System;
using Domain.Shared;

namespace Domain.Staff
{

    public class StaffId : EntityId
    {
        public StaffId(Guid value) : base(value)
        {
        }

        public StaffId(string value) : base(value)
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