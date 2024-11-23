using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.Shared;

namespace DDDNetCore.Domain.Appointments;

public class CreatingAppointmentDto {
    public RequestCode RequestCode { get; set; }
    public SurgeryRoomNumber SurgeryRoomNumber { get; set; }
    public AppointmentNumber AppointmentNumber { get; set; }
    public Slot AppointmentDate { get; set; }

    public CreatingAppointmentDto ()
    {
    }

    public CreatingAppointmentDto(RequestCode requestCode, SurgeryRoomNumber surgeryRoomNumber, AppointmentNumber appointmentNumber, Slot appointmentDate)
    {
        RequestCode = requestCode;
        SurgeryRoomNumber = surgeryRoomNumber;
        AppointmentNumber = appointmentNumber;
        AppointmentDate = appointmentDate;
    }
}