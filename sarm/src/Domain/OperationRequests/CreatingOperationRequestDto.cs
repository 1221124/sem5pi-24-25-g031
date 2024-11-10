using System;
using Domain.OperationTypes;
using Domain.Patients;
using Domain.Shared;
using Domain.Staffs;


namespace Domain.OperationRequests
{
        public class CreatingOperationRequestDto{
            // public StaffId StaffId { get; set; }
            // public PatientId PatientId { get; set; }
            // public OperationTypeId OperationTypeId { get; set; }
            public LicenseNumber Staff { get; set; }
            public MedicalRecordNumber Patient { get; set; }
            public Name OperationType { get; set; }
            public DeadlineDate DeadlineDate { get; set; }
            public Priority Priority { get; set; }

        // public CreatingOperationRequestDto(StaffId staffId, PatientId patientId, OperationTypeId operationTypeId, DeadlineDate deadlineDate, Priority priority)
        // {
        //     StaffId = staffId;
        //     PatientId = patientId;
        //     OperationTypeId = operationTypeId;
        //     DeadlineDate = deadlineDate;
        //     Priority = priority;
        // }

        public CreatingOperationRequestDto(LicenseNumber staff, MedicalRecordNumber patient, Name operationType, DeadlineDate deadlineDate, Priority priority)
        {
            Staff = staff;
            Patient = patient;
            OperationType = operationType;
            DeadlineDate = deadlineDate;
            Priority = priority;
        }
    }
}