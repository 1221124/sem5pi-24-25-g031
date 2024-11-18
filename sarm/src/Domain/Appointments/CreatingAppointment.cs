using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.Surgeries;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.OperationRequests;

namespace DDDNetCore.Domain.Appointments;

public class CreatingAppointment{
    public OperationRequestId OperationRequestId { get; private set; }
    public SurgeryRoomNumber SurgeryRoomNumber { get; private set; }
    public AppointmentDate AppointmentDate { get; private set; }

    public CreatingAppointment()
    {
    }

    public CreatingAppointment(OperationRequestId operationRequestId, SurgeryRoomNumber surgeryRoomNumber, AppointmentDate appointmentDate)
    {
        OperationRequestId = operationRequestId;
        SurgeryRoomNumber = surgeryRoomNumber;
        AppointmentDate = appointmentDate;
    }
}