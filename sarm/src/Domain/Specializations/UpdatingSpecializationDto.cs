using Domain.Shared;

namespace DDDNetCore.Domain.Specializations;

public class UpdatingSpecializationDto
{
    public Name Name { get; set; }
    
    public Description Description { get; set; }

    public UpdatingSpecializationDto(Name name, Description description)
    {
        Name = name;
        Description = description;
    }
}