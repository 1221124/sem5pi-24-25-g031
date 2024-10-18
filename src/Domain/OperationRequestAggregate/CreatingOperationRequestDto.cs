using System;
using System.Collections.Generic;
using Domain.OperationTypes;
using Domain.Shared;

namespace Domain.OperationRequestAggregate
{
    public class CreatingOperationRequestDto
    {
        public OperationRequestId Id { get; set; }
        /*public PatientId PatientId { get; set; }
        public DoctorId DoctorId { get; set; }*/
        public OperationTypeId OperationTypeId { get; set; }
        public DateTime DeadlineDate { get; set; }
        public Priority Priority { get; set; }

        public CreatingOperationRequestDto(OperationRequestId id, /*PatientId patientId, DoctorId doctorId,*/ OperationTypeId operationTypeId, DateTime deadlineDate, Priority priority)
        {
            Id = id;
            /*PatientId = patientId;
            DoctorId = doctorId;*/
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate;
            Priority = priority;
        }
    }
}