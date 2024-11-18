using DDDNetCore.Domain.SurgeryRooms;
using Domain.OperationRequests;


namespace DDDNetCore.Domain.Appointments
{
    public class AppointmentMapper
    {
        public static CreatingAppointment ToCreating(
        string operationRequestId, string surgeryNumber, string appointmentDate
        ){
            return new CreatingAppointment(
                new OperationRequestId(operationRequestId),
                SurgeryRoomNumberUtils.FromString(surgeryNumber),
                new AppointmentDate(appointmentDate)
            );
        }
        
        public static Appointment ToEntity(CreatingAppointment creatingAppointment, int count)
        {
            return new Appointment(
                creatingAppointment.OperationRequestId,
                creatingAppointment.SurgeryRoomNumber,
                new AppointmentNumber("so" +  count),
                creatingAppointment.AppointmentDate
            );
        }
    }
}