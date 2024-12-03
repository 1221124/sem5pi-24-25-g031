using Domain.Shared;
using Version = Domain.Shared.Version;

namespace Domain.OperationTypes
{
    public class OperationTypeDto
    {
        public Guid Id { get; set; }
        public OperationTypeCode OperationTypeCode { get; set; }
        public Name Name { get; set; }
        
        public Specialization Specialization { get; set; }

        public List<RequiredStaff> RequiredStaff { get; set; }

        public PhasesDuration PhasesDuration { get; set; }

        public Status Status { get; set; }
        public Version Version { get; set; }
    }
}