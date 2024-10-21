using System.Collections.Generic;
using Domain.Shared;

namespace Domain.OperationTypes
{
    public class OperationTypeDto
    {
        public Name Name { get; set; }

        public Specialization Specialization { get; set; }

        public List<RequiredStaff> _requiredStaff { get; set; }

        public PhasesDuration PhasesDuration { get; set; }

        public Status status { get; set; }
    }
}