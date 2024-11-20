using Domain.Shared;

namespace Domain.OperationTypes
{
    public class OperationType : Entity<OperationTypeId>, IAggregateRoot
    {
        public Name Name { get; set; }

        public Specialization Specialization { get; set; }

        public List<RequiredStaff> RequiredStaff { get; set; }

        public PhasesDuration PhasesDuration { get; set; }

        public Status Status { get; set; }

        public OperationType() { }

        public OperationType(Guid id, Name name, Specialization specialization, List<RequiredStaff> requiredStaff, PhasesDuration phasesDuration, Status status)
        {
            Id = new OperationTypeId(id);
            Name = name;
            Specialization = specialization;
            RequiredStaff = requiredStaff;
            PhasesDuration = phasesDuration;
            Status = status;
        }
        
        public OperationType(Name name, Specialization specialization, List<RequiredStaff> requiredStaff, PhasesDuration phasesDuration)
        {
            Id = new OperationTypeId(Guid.NewGuid());
            Name = name;
            Specialization = specialization;
            RequiredStaff = requiredStaff;
            PhasesDuration = phasesDuration;
            Status = Status.Active;
        }

        public OperationType(string name, string specialization, List<string> requiredStaff, List<string> phasesDuration)
        {
            Id = new OperationTypeId(Guid.NewGuid());
            Name = name;
            Specialization = SpecializationUtils.FromString(specialization);
            RequiredStaff = RequiredStaffUtils.FromStringList(requiredStaff);
            PhasesDuration = PhasesDuration.FromString(phasesDuration);
            Status = Status.Active;
        }
    }
}