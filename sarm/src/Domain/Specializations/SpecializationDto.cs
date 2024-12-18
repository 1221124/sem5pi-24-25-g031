using Domain.Shared;

namespace DDDNetCore.Domain.Specializations;

public class SpecializationDto
{
    public Guid Id { get; set; }
    public SNOMEDCTCode SNOMEDCTCode { get; set; }
    public Name Name { get; set; }
    public Description Description { get; set; }

    public SpecializationDto(Guid id, SNOMEDCTCode snomedctCode, Name name, Description description)
    {
        Id = id;
        SNOMEDCTCode = snomedctCode;
        Name = name;
        Description = description;
    }
}