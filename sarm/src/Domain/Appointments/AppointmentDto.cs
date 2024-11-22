using DDDNetCore.Domain.SurgeryRooms;
using Domain.OperationRequests;
using Domain.Shared;

namespace DDDNetCore.Domain.Appointments;

public class AppointmentDto
{
    public Guid Id { get; set; }
    public OperationRequestId OperationRequestId { get; set; }
    public SurgeryRoomNumber SurgeryRoomNumber { get; set; }
    public AppointmentNumber AppointmentNumber { get; set; }
    public Slot AppointmentDate { get; set; }

    public AppointmentDto()
    {
    }

    public AppointmentDto(Guid id, OperationRequestId operationRequestId, SurgeryRoomNumber surgeryRoomNumber, AppointmentNumber appointmentNumber, Slot appointmentDate)
    {
        Id = id;
        OperationRequestId = operationRequestId;
        SurgeryRoomNumber = surgeryRoomNumber;
        AppointmentNumber = appointmentNumber;
        AppointmentDate = appointmentDate;
    }

}