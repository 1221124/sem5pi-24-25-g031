using Domain.Shared;

namespace DDDNetCore.src.Domain.RoomTypes
{
    public class RoomTypeMapper
    {
        public static CreatingRoomTypeDto ToCreating(
            string name, string description, bool IsAvailableForSurgeries
        )
        {
            return new CreatingRoomTypeDto(
                new Name(name),
                new Description(description),
                IsAvailableForSurgeries
            );
        }

        public static RoomType ToEntity(RoomTypeDto dto)
        {
            return new RoomType(
                new RoomTypeId(dto.Id),
                dto.RoomTypeCode,
                dto.Name,
                dto.Description,
                dto.AvailableForSurgeries
            );
        }

        public static RoomTypeDto ToDto(RoomType entity)
        {
            return new RoomTypeDto(
                entity.Id.AsGuid(),
                entity.RoomTypeCode,
                entity.Name,
                entity.Description,
                entity.AvailableForSurgeries
            );
        }

    }
}