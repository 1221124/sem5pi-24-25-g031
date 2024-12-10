using Domain.Shared;
using Version = Domain.Shared.Version;

namespace Domain.OperationTypes
{
    public class OperationType : Entity<OperationTypeId>, IAggregateRoot
    {
        public OperationTypeCode OperationTypeCode { get; set; }
        public Name Name { get; set; }
        public Specialization Specialization { get; set; }
        public List<RequiredStaff> RequiredStaff { get; set; }
        public PhasesDuration PhasesDuration { get; set; }
        public Status Status { get; set; }
        public Version Version { get; set; }

        public OperationType() { }

        public OperationType(Guid id, OperationTypeCode operationTypeCode, Name name, Specialization specialization, List<RequiredStaff> requiredStaff, PhasesDuration phasesDuration, Status status)
        {
            Id = new OperationTypeId(id);
            OperationTypeCode = operationTypeCode;
            Name = name;
            Specialization = specialization;
            RequiredStaff = requiredStaff;
            PhasesDuration = phasesDuration;
            Status = status;
            Version = new Version(1);
        }

        public OperationType(OperationTypeCode operationTypeCode, Name name, Specialization specialization, List<RequiredStaff> requiredStaff, PhasesDuration phasesDuration, Status status, Version version)
        {
            Id = new OperationTypeId(Guid.NewGuid());
            OperationTypeCode = operationTypeCode;
            Name = name;
            Specialization = specialization;
            RequiredStaff = requiredStaff;
            PhasesDuration = phasesDuration;
            Status = status;
            Version = version;
        }
        
        public OperationType(OperationTypeCode operationTypeCode, Name name, Specialization specialization, List<RequiredStaff> requiredStaff, PhasesDuration phasesDuration)
        {
            Id = new OperationTypeId(Guid.NewGuid());
            OperationTypeCode = operationTypeCode;
            Name = name;
            Specialization = specialization;
            RequiredStaff = requiredStaff;
            PhasesDuration = phasesDuration;
            Status = Status.Active;
            Version = new Version(1);
        }
    }
}