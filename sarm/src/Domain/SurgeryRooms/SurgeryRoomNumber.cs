namespace DDDNetCore.Domain.SurgeryRooms;

public enum SurgeryRoomNumber
{
    OR1,
    OR2,
    OR3,
    OR4,
    OR5,
    OR6
}

public class SurgeryRoomNumberUtils
{
    public static SurgeryRoomNumber FromString(string surgeryRoomNumber)
    {
        return surgeryRoomNumber.ToUpper() switch
        {
            "OR1" => SurgeryRoomNumber.OR1,
            "OR2" => SurgeryRoomNumber.OR2,
            "OR3" => SurgeryRoomNumber.OR3,
            "OR4" => SurgeryRoomNumber.OR4,
            "OR5" => SurgeryRoomNumber.OR5,
            "OR6" => SurgeryRoomNumber.OR6,
            _ => throw new ArgumentException("Invalid surgery room number")
        };
    }

    public static string ToString(SurgeryRoomNumber surgeryRoomNumber)
    {
        return surgeryRoomNumber switch
        {
            SurgeryRoomNumber.OR1 => "OR1",
            SurgeryRoomNumber.OR2 => "OR2",
            SurgeryRoomNumber.OR3 => "OR3",
            SurgeryRoomNumber.OR4 => "OR4",
            SurgeryRoomNumber.OR5 => "OR5",
            SurgeryRoomNumber.OR6 => "OR6",
            _ => throw new ArgumentException("Invalid surgery room number")
        };
    }
}