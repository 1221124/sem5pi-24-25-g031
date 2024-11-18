namespace DDDNetCore.Domain.SurgeryRooms;

public enum SurgeryRoomNumber
{
    SO1,
    SO2,
    SO3,
    SO4,
    SO5,
    SO6
}

public class SurgeryRoomNumberUtils
{
    public static SurgeryRoomNumber FromString(string surgeryRoomNumber)
    {
        return surgeryRoomNumber.ToUpper() switch
        {
            "SO1" => SurgeryRoomNumber.SO1,
            "SO2" => SurgeryRoomNumber.SO2,
            "SO3" => SurgeryRoomNumber.SO3,
            "SO4" => SurgeryRoomNumber.SO4,
            "SO5" => SurgeryRoomNumber.SO5,
            "SO6" => SurgeryRoomNumber.SO6,
            _ => throw new ArgumentException("Invalid surgery room number")
        };
    }

    public static string ToString(SurgeryRoomNumber surgeryRoomNumber)
    {
        return surgeryRoomNumber switch
        {
            SurgeryRoomNumber.SO1 => "SO1",
            SurgeryRoomNumber.SO2 => "SO2",
            SurgeryRoomNumber.SO3 => "SO3",
            SurgeryRoomNumber.SO4 => "SO4",
            SurgeryRoomNumber.SO5 => "SO5",
            SurgeryRoomNumber.SO6 => "SO6",
            _ => throw new ArgumentException("Invalid surgery room number")
        };
    }
}