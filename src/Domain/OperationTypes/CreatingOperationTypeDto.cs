using System.Collections.Generic;
using Domain.Shared;

namespace Domain.OperationTypes
{
    public class CreatingOperationTypeDto
    {
        public Name Name { get; set; }

        public Specialization Specialization { get; set; }

        public List<RequiredStaff> _requiredStaff { get; set; }

        public PhasesDuration PhasesDuration { get; set; }


        public CreatingOperationTypeDto(string name, string specialization, string requiredStaff, string phasesDuration)
        {
            Name = name;
            Specialization = SpecializationUtils.FromString(specialization);
            _requiredStaff = RequiredStaff.FromString(requiredStaff);
            PhasesDuration = phasesDuration;
        }
    }
}