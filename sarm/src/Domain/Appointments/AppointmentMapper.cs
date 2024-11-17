using DDDNetCore.Domain.Surgeries;
using Domain.OperationRequests;
using Domain.OperationTypes;
using Domain.Shared;

namespace DDDNetCore.Domain.Appointments
{
    public class AppointmentMapper
    {
        public static Appointment ToEntity(CreatingAppointment creatingAppointment, OperationRequestDto operationRequestDto)
        {
            return new Appointment(
                creatingAppointment.OperationRequestId,
                operationRequestDto.Priority,
                operationRequestDto.OperationType,
                creatingAppointment.SurgeryNumber,
                creatingAppointment.AppointmentDate
            );
        }
    }
}