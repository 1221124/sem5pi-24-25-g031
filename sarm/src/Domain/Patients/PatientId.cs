using System;
using Domain.Shared;
using Newtonsoft.Json;

namespace Domain.Patients
{
    public class PatientId : EntityId
    {
        [JsonConstructor]
        public PatientId(Guid value) : base(value)
        {
        }

        public PatientId(String value) : base(value)
        {
        }
        
        
        public PatientId() : base(Guid.NewGuid())
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