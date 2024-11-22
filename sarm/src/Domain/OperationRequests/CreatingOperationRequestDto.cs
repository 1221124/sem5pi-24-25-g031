using DDDNetCore.Domain.OperationRequests;
using Domain.Patients;
using Domain.Shared;
using Domain.Staffs;


namespace DDDNetCore.Domain.OperationRequests
{
    public class CreatingOperationRequestDto
    {
        public LicenseNumber Staff { get; set; }
        public MedicalRecordNumber Patient { get; set; }
        public Name OperationType { get; set; }
        public DeadlineDate DeadlineDate { get; set; }
        public Priority Priority { get; set; }

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