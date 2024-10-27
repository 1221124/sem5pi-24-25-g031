using System;
using Domain.Shared;
using Newtonsoft.Json;

namespace Domain.OperationTypes
{
    public class OperationTypeId : EntityId
    {
        [JsonConstructor]
        public OperationTypeId(Guid value) : base(value)
        {
        }

        public OperationTypeId(String value) : base(value)
        {
        }

        override
        public  Object createFromString(String text){
            return new Guid(text);
        }

        override
        public String AsString(){
            Guid obj = (Guid) base.ObjValue;
            return obj.ToString();
        }
        
       
        public Guid AsGuid(){
            return (Guid) base.ObjValue;
        }
    }
}