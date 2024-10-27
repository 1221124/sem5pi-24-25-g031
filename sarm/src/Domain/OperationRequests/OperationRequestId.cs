using System.Text.Json.Serialization;
using Domain.Shared;

namespace Domain.OperationRequests
{
    public class OperationRequestId : EntityId
    {
        [JsonConstructor]
        public OperationRequestId(Guid value) : base(value)
        {
        }

        public OperationRequestId(string value) : base(value)
        {
        }

        override
        public  Object createFromString(string text){
            return new Guid(text);
        }

        override
        public string AsString(){
            Guid obj = (Guid) base.ObjValue;
            return obj.ToString();
        }
        
       
        public Guid AsGuid(){
            return (Guid) base.ObjValue;
        }


        public static implicit operator OperationRequestId(Guid value)
            => new OperationRequestId(value);

        public static implicit operator OperationRequestId(string value)
            => new OperationRequestId(value);

        public static implicit operator Guid(OperationRequestId id)
            => id.AsGuid();

            
    }
}