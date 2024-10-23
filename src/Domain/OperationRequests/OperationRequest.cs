using System;
using Domain.Shared;
using Domain.OperationTypes;
using Domain.Patients;
using Domain.Staffs;
using Azure;

namespace Domain.OperationRequests
{
    public class OperationRequest : Entity<OperationRequestId>, IAggregateRoot
    {
        public PatientId PatientId { get; set; }

        public StaffId DoctorId { get; set; }

        public OperationTypeId OperationTypeId { get; set; }
        public DateTime DeadlineDate { get; set; }
        public Priority Priority { get; set; }
        public RequestStatus Status {get; set;}

        public OperationRequest(StaffId doctorId, PatientId patientId, OperationTypeId operationTypeId, DateTime deadlineDate, Priority priority)
        {
            Id = new OperationRequestId(Guid.NewGuid());
            DoctorId = doctorId;
            PatientId = patientId;
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate;
            Priority = priority;
            Status = RequestStatus.PENDING;
        }
        
        public OperationRequest(StaffId doctorId, PatientId patientId, OperationTypeId operationTypeId, DateTime deadlineDate, Priority priority, RequestStatus status)
        {
            Id = new OperationRequestId(Guid.NewGuid());
            DoctorId = doctorId;
            PatientId = patientId;
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate;
            Priority = priority;
            Status = status;
        }

        public OperationRequest(Guid id, StaffId doctorId, PatientId patientId, OperationTypeId operationTypeId, DateTime deadlineDate, Priority priority, RequestStatus status)
        {
            Id = new OperationRequestId(id);
            DoctorId = doctorId;
            PatientId = patientId;
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate;
            Priority = priority;
            Status = status;
        }

        public OperationRequest(OperationRequestId id, StaffId staffId, PatientId patientId, OperationTypeId operationTypeId, DateTime dateTime, Priority priority)
        {
            Id = id;
            DoctorId = staffId;
            PatientId = patientId;
            OperationTypeId = operationTypeId;
            DeadlineDate = dateTime;
            Priority = priority;
        }

        internal void Update(PatientId patientId, StaffId doctorId, OperationTypeId operationTypeId, DateTime deadlineDate, Priority priority, RequestStatus status)
        {
            if(PatientId != patientId){
                PatientId = patientId;
            }

            if(DoctorId != doctorId){
                DoctorId = doctorId;
            }

            if(OperationTypeId != operationTypeId){
                OperationTypeId = operationTypeId;
            }

            if(DeadlineDate != deadlineDate){
                DeadlineDate = deadlineDate;
            }

            if(Priority != priority){
                Priority = priority;
            }

            if(Status != status){
                Status = status;
            }
        }
    }
}