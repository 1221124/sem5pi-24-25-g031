using Domain.Shared;

namespace DDDNetCore.Domain.Surgeries;

public class SurgeryId: EntityId
{
    public SurgeryId(Guid value) : base(value)
    {
    }
    
    public SurgeryId(string value) : base(value)
    {
    }
    
    public override object createFromString(string text)
    {
        throw new NotImplementedException();
    }

    public override string AsString()
    {
        throw new NotImplementedException();
    }
}