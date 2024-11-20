using DDDNetCore.Domain.SurgeryRooms;
using Domain.OperationRequests;
using Domain.Shared;

namespace DDDNetCore.Domain.Appointments;

public class CreatingAppointment{
    public OperationRequestId OperationRequestId { get; set; }
    public SurgeryRoomNumber SurgeryRoomNumber { get; set; }
    public Slot AppointmentDate { get; set; }

    public CreatingAppointment()
    {
    }

    public CreatingAppointment(OperationRequestId operationRequestId, SurgeryRoomNumber surgeryRoomNumber, Slot appointmentDate)
    {
        OperationRequestId = operationRequestId;
        SurgeryRoomNumber = surgeryRoomNumber;
        AppointmentDate = appointmentDate;
    }
}