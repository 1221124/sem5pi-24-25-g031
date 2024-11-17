using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.Surgeries;
using Domain.OperationRequests;
using Domain.Shared;
using Domain.Staffs;

namespace DDDNetCore.Domain.Appointments;

public class Appointment : Entity<AppointmentId>, IAggregateRoot
{
    public OperationRequestId OperationRequestId { get; private set; }
    public Priority Priority { get; private set; }
    public Name OperationType { get; private set; }
    public SurgeryNumber SurgeryNumber { get; private set; }
    public AppointmentDate AppointmentDate { get; private set; }

    public Appointment()
    {
    }

    public Appointment(OperationRequestId operationRequestId, Priority priority, Name operationType, SurgeryNumber surgeryNumber, AppointmentDate appointmentDate)
    {
        Id = new AppointmentId(Guid.NewGuid());
        OperationRequestId = operationRequestId;
        Priority = priority;
        OperationType = operationType;
        SurgeryNumber = surgeryNumber;
        AppointmentDate = appointmentDate;
    }

    //update time
    public void UpdateTime(DateTime dateTime){
        AppointmentDate.UpdateTime(dateTime);
    }
}