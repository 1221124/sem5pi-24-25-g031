using DDDNetCore.Domain.SurgeryRooms;
using Domain.OperationRequests;
using Domain.Shared;

namespace DDDNetCore.Domain.Appointments;

public class Appointment : Entity<AppointmentId>, IAggregateRoot
{
    public OperationRequestId OperationRequestId { get; private set; }
    public SurgeryRoomNumber SurgeryRoomNumber { get; private set; }
    public AppointmentNumber AppointmentNumber { get; private set; }
    public AppointmentDate AppointmentDate { get; private set; }

    public Appointment()
    {
    }

    public Appointment(OperationRequestId operationRequestId, SurgeryRoomNumber surgeryRoomNumber, AppointmentNumber appointmentNumber, AppointmentDate appointmentDate)
    {
        Id = new AppointmentId(Guid.NewGuid());
        OperationRequestId = operationRequestId;
        SurgeryRoomNumber = surgeryRoomNumber;
        AppointmentNumber = appointmentNumber;
        AppointmentDate = appointmentDate;
    }

    //update time
    public void UpdateTime(DateTime dateTime){
        AppointmentDate.UpdateTime(dateTime);
    }

}