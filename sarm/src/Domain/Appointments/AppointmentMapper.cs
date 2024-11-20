using DDDNetCore.Domain.SurgeryRooms;
using Domain.OperationRequests;
using Domain.Shared;


namespace DDDNetCore.Domain.Appointments
{
    public class AppointmentMapper
    {
        public static CreatingAppointment ToCreating(
        string operationRequestId, string surgeryNumber, string startDate, string endDate
        ){
            return new CreatingAppointment(
                new OperationRequestId(operationRequestId),
                SurgeryRoomNumberUtils.FromString(surgeryNumber),
                new Slot(startDate, endDate)
            );
        }
        
        public static Appointment ToEntity(CreatingAppointment creatingAppointment, int count)
        {
            return new Appointment(
                creatingAppointment.OperationRequestId,
                creatingAppointment.SurgeryRoomNumber,
                new AppointmentNumber("ap" +  count),
                creatingAppointment.AppointmentDate
            );
        }
    }
}