namespace DDDNetCore.Domain.SurgeryRooms;

public enum RoomType
{
    OPERATING_ROOM,
    CONSULTATION_ROOM,
    ICU
}

public class RoomTypeUtils
{
    public static RoomType FromString(string roomType)
    {
        return roomType.ToUpper() switch
        {
            "OPERATING ROOM" => RoomType.OPERATING_ROOM,
            "CONSULTATION ROOM" => RoomType.CONSULTATION_ROOM,
            "ICU" => RoomType.ICU,
            _ => throw new ArgumentException("Invalid room type")
        };
    }
    
    public static string ToString(RoomType roomType)
    {
        return roomType switch
        {
            RoomType.OPERATING_ROOM => "Operating Room",
            RoomType.CONSULTATION_ROOM => "Consultation Room",
            RoomType.ICU => "ICU",
            _ => "Unknown"
        };
    }
}