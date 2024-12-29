using Domain.Shared;

namespace DDDNetCore.Domain.Specializations
{
    public class CreatingSpecializationDto
    {
        public SNOMEDCTCode SNOMEDCTCode { get; set; }
        public Name Name { get; set; }
        public Description Description { get; set; }

        public CreatingSpecializationDto(SNOMEDCTCode snomedctCode, Name name, Description description)
        {
            SNOMEDCTCode = snomedctCode;
            Name = name;
            Description = description;
        }
    }
}