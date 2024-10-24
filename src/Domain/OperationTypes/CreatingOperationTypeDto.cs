using Domain.Shared;

namespace Domain.OperationTypes
{
    public class CreatingOperationTypeDto
    {
        public Name Name { get; set; }

        public Specialization Specialization { get; set; }

        public List<RequiredStaff> RequiredStaff { get; set; }

        public PhasesDuration PhasesDuration { get; set; }

        public CreatingOperationTypeDto(Name name, Specialization specialization, List<RequiredStaff> requiredStaff, PhasesDuration phasesDuration)
        {
            Name = name;
            Specialization = specialization;
            RequiredStaff = requiredStaff;
            PhasesDuration = phasesDuration;
        }
    }
}