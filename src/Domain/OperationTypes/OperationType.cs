using System;
using System.Collections.Generic;
using Domain.Shared;

namespace Domain.OperationTypes
{
    public class OperationType : Entity<OperationTypeId>, IAggregateRoot
    {
        public Name Name { get; set; }

        public Specialization Specialization { get; set; }

        public List<RequiredStaff> _requiredStaff { get; set; }

        public PhasesDuration PhasesDuration { get; set; }

        public Status Status { get; set; }

        public OperationType(Name name, Specialization specialization, List<RequiredStaff> requiredStaff, PhasesDuration phasesDuration)
        {
            Id = new OperationTypeId(Guid.NewGuid());
            Name = name;
            Specialization = specialization;
            _requiredStaff = requiredStaff;
            PhasesDuration = phasesDuration;
            Status = Status.Active;
        }

        public OperationType(string name, string specialization, string requiredStaff, string phasesDuration)
        {
            Id = new OperationTypeId(Guid.NewGuid());
            Name = name;
            Specialization = SpecializationUtils.FromString(specialization);
            _requiredStaff = RequiredStaff.FromString(requiredStaff);
            PhasesDuration = phasesDuration;
            Status = Status.Active;
        }
    }
}