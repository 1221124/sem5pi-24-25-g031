using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.Shared;

namespace DDDNetCore.Domain.Appointments;

public class Appointment : Entity<AppointmentId>, IAggregateRoot
{
    public OperationRequestId OperationRequestId { get; private set; }
    public SurgeryRoomNumber SurgeryRoomNumber { get; private set; }
    public AppointmentNumber AppointmentNumber { get; private set; }
    public Slot AppointmentDate { get; private set; }

    public Appointment()
    {
    }

    public Appointment(OperationRequestId operationRequestId, SurgeryRoomNumber surgeryRoomNumber, AppointmentNumber appointmentNumber, Slot appointmentDate)
    {
        Id = new AppointmentId(Guid.NewGuid());
        OperationRequestId = operationRequestId;
        SurgeryRoomNumber = surgeryRoomNumber;
        AppointmentNumber = appointmentNumber;
        AppointmentDate = appointmentDate;
    }

}