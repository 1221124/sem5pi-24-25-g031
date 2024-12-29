using Domain.Shared;

namespace DDDNetCore.Domain.Specializations
{
    public class CreatingSpecializationDto
    {
        public Name Name { get; set; }
        public Description Description { get; set; }

        public CreatingSpecializationDto(Name name, Description description)
        {
            Name = name;
            Description = description;
        }
    }
}