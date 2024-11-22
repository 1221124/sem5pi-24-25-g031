using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.Shared;

namespace DDDNetCore.Domain.Appointments;

public class CreatingAppointmentDto {
    public OperationRequestId OperationRequestId { get; set; }
    public SurgeryRoomNumber SurgeryRoomNumber { get; set; }
    public Slot AppointmentDate { get; set; }

    public CreatingAppointmentDto ()
    {
    }

    public CreatingAppointmentDto(OperationRequestId operationRequestId, SurgeryRoomNumber surgeryRoomNumber, Slot appointmentDate)
    {
        OperationRequestId = operationRequestId;
        SurgeryRoomNumber = surgeryRoomNumber;
        AppointmentDate = appointmentDate;
    }
}