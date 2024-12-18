using DDDNetCore.src.Domain.RoomTypes;
using Domain.Shared;
using Newtonsoft.Json;

namespace DDDNetCore.Domain.Specializations;

public class SpecializationId : EntityId
{
    [JsonConstructor]
    public SpecializationId(Guid value) : base(value)
    {
    }

    public SpecializationId(String value) : base(value)
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
        
    // Ensure that ToString() and other methods are consistent for comparisons
    public override bool Equals(object? obj)
    {
        if (obj is SpecializationId other)
        {
            return this.Value == other.Value;  // Ensure correct GUID comparison
        }
        return false;
    }

    public override int GetHashCode()
    {
        return Value.GetHashCode();
    }
}