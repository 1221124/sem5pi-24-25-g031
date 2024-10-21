using System;
using Domain.OperationTypes;
using Domain.Shared;

namespace Domain.OperationRequestAggregate
{
    public class OperationRequestDto
    {
        public Guid Id { get; set; }

        /*public PatientId patientId { get; set; }

        public UserId userId { get; set; }*/

        public OperationTypeId OperationTypeId { get; set; }
        public DateTime DeadlineDate { get; set; }
        public Priority Priority { get; set; }
        public RequestStatus Status {get; set;}
        
        public OperationRequestDto(Guid id, /*PatientId patientId, DoctorId doctorId,*/ OperationTypeId operationTypeId, DateTime deadlineDate, Priority priority)
        {
            Id = id;
            /*this.patientId = patientId;
            this.doctorId = doctorId;*/
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate;
            Priority = priority;
        }

        public OperationRequestDto(Guid id)
        {
            Id = id;
        }

        public OperationRequestDto()
        {
        }
    }
}