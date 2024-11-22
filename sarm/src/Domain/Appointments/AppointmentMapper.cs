using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.Shared;


namespace DDDNetCore.Domain.Appointments
{
    public class AppointmentMapper
    {
        public static CreatingAppointmentDto ToCreating(
        string operationRequestId, string surgeryRoomNumber, string startDate, string endDate
        ){
            return new CreatingAppointmentDto(
                new OperationRequestId(operationRequestId),
                SurgeryRoomNumberUtils.FromString(surgeryRoomNumber),
                new Slot(startDate, endDate)
            );
        }
        
        public static Appointment ToEntity(CreatingAppointmentDto creatingAppointment, int count)
        {
            return new Appointment(
                creatingAppointment.OperationRequestId,
                creatingAppointment.SurgeryRoomNumber,
                new AppointmentNumber("ap" +  count),
                creatingAppointment.AppointmentDate
            );
        }

        public static AppointmentDto ToDto(Appointment appointment)
        {
            return new AppointmentDto(
                appointment.Id.AsGuid(),
                appointment.OperationRequestId,
                appointment.SurgeryRoomNumber,
                appointment.AppointmentNumber,
                appointment.AppointmentDate
            );
        }
    }
}