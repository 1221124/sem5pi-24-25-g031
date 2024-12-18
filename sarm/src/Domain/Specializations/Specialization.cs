using Domain.Shared;

namespace DDDNetCore.Domain.Specializations;

public class Specialization : Entity<SpecializationId>, IAggregateRoot
{
    public SNOMEDCTCode SNOMEDCTCode { get; set; }
    public Name Name { get; set; }
    public Description Description { get; set; }

    public Specialization(SNOMEDCTCode snomedctCode, Name name, Description description)
    {
        Id = new SpecializationId(Guid.NewGuid());
        SNOMEDCTCode = snomedctCode;
        Name = name;
        Description = description;
    }
    
    public Specialization(SpecializationId id, SNOMEDCTCode snomedCode, Name name, Description description)
    {
        Id = id;
        SNOMEDCTCode = snomedCode;
        Name = name;
        Description = description;
    }
}
