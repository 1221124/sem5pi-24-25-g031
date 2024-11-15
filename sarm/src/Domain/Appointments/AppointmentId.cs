using Domain.Shared;
using Newtonsoft.Json;

namespace DDDNetCore.Domain.Appointments;

public class AppointmentId : EntityId
{
    [JsonConstructor]
    public AppointmentId(Guid value) : base(value)
    {
    }
    
    public AppointmentId(string value) : base(value)
    {
    }
    
    public override object createFromString(string text)
    {
        //new Guid(text);
        return new Guid(text);
    }

    public override string AsString()
    {
 
        return ObjValue.ToString()!;
    }
}