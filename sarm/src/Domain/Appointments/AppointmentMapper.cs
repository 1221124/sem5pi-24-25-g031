using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.Shared;


namespace DDDNetCore.Domain.Appointments
{
    public class AppointmentMapper
    {
        public static CreatingAppointmentDto ToCreating(
        string requestCode, string surgeryRoomNumber, string startDate, string endDate, string appointmentNumber
        ){
            return new CreatingAppointmentDto(
                new RequestCode(requestCode),
                SurgeryRoomNumberUtils.FromString(surgeryRoomNumber),
                new AppointmentNumber(appointmentNumber),
                new Slot(startDate, endDate)
            );
        }
        
        public static Appointment ToEntity(CreatingAppointmentDto creatingAppointment)
        {
            return new Appointment(
                creatingAppointment.RequestCode,
                creatingAppointment.SurgeryRoomNumber,
                creatingAppointment.AppointmentNumber,
                creatingAppointment.AppointmentDate
            );
        }

        public static AppointmentDto ToDto(Appointment appointment)
        {
            return new AppointmentDto(
                appointment.Id.AsGuid(),
                appointment.RequestCode,
                appointment.SurgeryRoomNumber,
                appointment.AppointmentNumber,
                appointment.AppointmentDate,
                appointment.AssignedStaff
            );
        }
    }
}