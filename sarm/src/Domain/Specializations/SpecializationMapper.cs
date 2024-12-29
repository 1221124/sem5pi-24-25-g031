using System.Xml;
using Domain.Shared;

namespace DDDNetCore.Domain.Specializations
{
    public class SpecializationMapper
    {
        public static CreatingSpecializationDto ToCreating(
            string name, string description, string snomedctCode
        )
        {
            return new CreatingSpecializationDto(
                new SNOMEDCTCode(snomedctCode),
                new Name(name),
                new Description(description)
            );
        }

        public static Specialization ToEntity(SpecializationDto dto)
        {
            return new Specialization(
                new SpecializationId(dto.Id),
                dto.SNOMEDCTCode,
                dto.Name,
                dto.Description
            );
        }

        public static SpecializationDto ToDto(Specialization entity)
        {
            return new SpecializationDto(
                entity.Id.AsGuid(),
                entity.SNOMEDCTCode,
                entity.Name,
                entity.Description
            );
        }

        public static List<SpecializationDto> ToDtoList(List<Specialization> entities)
        {
            return entities.Select(entity => ToDto(entity)).ToList();
        }
    }
}