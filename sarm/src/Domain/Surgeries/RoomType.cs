namespace DDDNetCore.Domain.Surgeries
{
    public enum RoomType{
        OPERATING_ROOM,
        CONSULTATION_ROOM,
        ICU
    }

    public class RoomTypeUtils{
        public static RoomType FromString(string roomType){
            switch(roomType.ToUpper()){
                case "OPERATING_ROOM":
                    return RoomType.OPERATING_ROOM;
                case "CONSULTATION_ROOM":
                    return RoomType.CONSULTATION_ROOM;
                case "ICU":
                    return RoomType.ICU;
                default:
                    throw new System.ArgumentException("Invalid room type");
            }
        }

        public static string ToString(RoomType roomType){
            switch(roomType){
                case RoomType.OPERATING_ROOM:
                    return "OPERATING ROOM";
                case RoomType.CONSULTATION_ROOM:
                    return "CONSULTATION ROOM";
                case RoomType.ICU:
                    return "ICU";
                default:
                    throw new System.ArgumentException("Invalid room type");
            }
        }
    }    
}