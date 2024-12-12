using Domain.Shared;

namespace DDDNetCore.src.Domain.RoomTypes
{
    public class RoomType: Entity<RoomTypeId>, IAggregateRoot
    {
        public RoomTypeCode RoomTypeCode { get; set; }
        public Name Name { get; set; }
        public Description Description { get; set; }
        public bool AvailableForSurgeries { get; set; }
        
        public RoomType(RoomTypeCode roomTypeCode, Name name, Description description, bool availableForSurgeries)
        {
            Id = new RoomTypeId(Guid.NewGuid());
            RoomTypeCode = roomTypeCode;
            Name = name;
            Description = description;
            AvailableForSurgeries = availableForSurgeries;
        }

        public RoomType(RoomTypeId id, RoomTypeCode roomTypeCode, Name name, Description description, bool availableForSurgeries)
        {
            Id = id;
            RoomTypeCode = roomTypeCode;
            Name = name;
            Description = description;
            AvailableForSurgeries = availableForSurgeries;
        }
    }
}