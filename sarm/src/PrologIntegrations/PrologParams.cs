using DDDNetCore.Domain.SurgeryRooms;

namespace DDDNetCore.PrologIntegrations
{
    public class PrologParams
    {
        public SurgeryRoomNumber SurgeryRoomNumber { get; set; }
        public DateTime DateTime { get; set; }
        public int Option { get; set; }

        public PrologParams(SurgeryRoomNumber surgeryRoomNumber, DateTime dateTime, int option)
        {
            SurgeryRoomNumber = surgeryRoomNumber;
            DateTime = dateTime;
            Option = option;
        }
    }
}