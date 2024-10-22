using Domain.Shared;

namespace Domain.OperationTypes
{
    public class CreatingOperationTypeDto
    {
        public string Name { get; set; }

        public string Specialization { get; set; }

        public List<string> RequiredStaff { get; set; }

        public List<string> PhasesDuration { get; set; }

        public CreatingOperationTypeDto(string name, string specialization, List<string> requiredStaff, List<string> phasesDuration)
        {
            Name = name;
            Specialization = specialization;
            RequiredStaff = requiredStaff;
            PhasesDuration = phasesDuration;
        }
    }
}