using System;
using System.Text.Json.Serialization;
using Domain.Shared;
using Domain.Users;

namespace Domain.Staffs
{

    public class StaffId : EntityId
    {
        [JsonConstructor]
        public StaffId(Guid value) : base(value)
        {
        }

        public StaffId(String value) : base(value)
        {
        }

        public StaffId() : base(Guid.NewGuid())
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