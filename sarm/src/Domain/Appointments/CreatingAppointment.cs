using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.Surgeries;
using Domain.OperationRequests;

namespace DDDNetCore.Domain.Appointments;

public class CreatingAppointment{
    public OperationRequestId OperationRequestId { get; private set; }
    public SurgeryNumber SurgeryNumber { get; private set; }
    public AppointmentDate AppointmentDate { get; private set; }

    public CreatingAppointment()
    {
    }

    public CreatingAppointment(OperationRequestId operationRequestId, SurgeryNumber surgeryNumber, AppointmentDate appointmentDate)
    {
        OperationRequestId = operationRequestId;
        SurgeryNumber = surgeryNumber;
        AppointmentDate = appointmentDate;
    }
}