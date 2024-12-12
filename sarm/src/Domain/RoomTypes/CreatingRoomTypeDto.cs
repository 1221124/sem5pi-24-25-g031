using Domain.Shared;

namespace DDDNetCore.src.Domain.RoomTypes
{
    public class CreatingRoomTypeDto
    {
        public Name Name { get; set; }
        public Description Description { get; set; }
        public bool AvailableForSurgeries { get; set; }
        
        public CreatingRoomTypeDto(Name name, Description description, bool availableForSurgeries)
        {
            Name = name;
            Description = description;
            AvailableForSurgeries = availableForSurgeries;
        }
    }
}