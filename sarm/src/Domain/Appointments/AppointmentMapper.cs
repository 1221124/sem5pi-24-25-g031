namespace DDDNetCore.Domain.Appointments
{
    public class AppointmentMapper
    {   
        public static Appointment ToEntity(CreatingAppointmentDto creatingAppointment)
        {
            return new Appointment(
                creatingAppointment.RequestCode,
                creatingAppointment.SurgeryRoomNumber,
                creatingAppointment.AppointmentNumber,
                creatingAppointment.AppointmentDate,
                creatingAppointment.AssignedStaff
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

        public static List<AppointmentDto> ToDtoList(List<Appointment> appointments)
        {
            var appointmentDtos = new List<AppointmentDto>();
            foreach (var appointment in appointments)
            {
                appointmentDtos.Add(ToDto(appointment));
            }
            return appointmentDtos;
        }
    }
}