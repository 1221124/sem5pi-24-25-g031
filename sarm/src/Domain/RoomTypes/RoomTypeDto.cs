using Domain.Shared;

namespace DDDNetCore.src.Domain.RoomTypes
{
    public class RoomTypeDto
    {
        public Guid Id { get; set; }
        public RoomTypeCode RoomTypeCode { get; set; }
        public Name Name { get; set; }
        public Description Description { get; set; }
        public bool AvailableForSurgeries { get; set; }
        
        public RoomTypeDto(Guid id, RoomTypeCode roomTypeCode, Name name, Description description, bool availableForSurgeries)
        {
            Id = id;
            RoomTypeCode = roomTypeCode;
            Name = name;
            Description = description;
            AvailableForSurgeries = availableForSurgeries;
        }
    }
}