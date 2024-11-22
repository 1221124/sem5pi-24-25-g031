using Domain.Shared;
using Newtonsoft.Json;

namespace DDDNetCore.Domain.Appointments
{
    public class AppointmentId : EntityId
    {
        [JsonConstructor]
        public AppointmentId(Guid value) : base(value)
        {
        }

        public AppointmentId(String value) : base(value)
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