using System.Collections.Generic;
using System.Text.Json.Serialization;
using Domain.Shared;

namespace Domain.OperationTypes
{
    public class OperationTypeDto
    {
        public Guid Id { get; set; }
        public Name Name { get; set; }
        
        public Specialization Specialization { get; set; }

        public List<RequiredStaff> RequiredStaff { get; set; }

        public PhasesDuration PhasesDuration { get; set; }

        public Status Status { get; set; }
    }
}