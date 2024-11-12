using Xunit;
using Domain.OperationTypes;
using System;
using System.Collections.Generic;
using Domain.Shared;

namespace Tests.Domain.OperationTypes
{
    public class CreatingOperationTypeDtoTests
    {
        private readonly Name _name;
        private readonly Specialization _specialization;
        private readonly List<RequiredStaff> _requiredStaff;
        private readonly PhasesDuration _phasesDuration;

        public CreatingOperationTypeDtoTests()
        {
            _name = new Name("Example Operation");
            _specialization = Specialization.CARDIOLOGY;
            _requiredStaff =
            [
                new RequiredStaff(Role.Doctor, Specialization.CARDIOLOGY, new Quantity(1)),
                new RequiredStaff(Role.Nurse, Specialization.ANAESTHESIOLOGY, new Quantity(2))
            ];
            _phasesDuration = new PhasesDuration(new Dictionary<Phase, Quantity>
            {
                { Phase.Preparation, new Quantity(10) },
                { Phase.Surgery, new Quantity(20) },
                { Phase.Cleaning, new Quantity(5) }
            });
        }

        [Fact]
        public void Constructor_ShouldInitializeProperties()
        {
            var dto = new CreatingOperationTypeDto(_name, _specialization, _requiredStaff, _phasesDuration);

            Assert.Equal(_name, dto.Name);
            Assert.Equal(_specialization, dto.Specialization);
            Assert.Equal(_requiredStaff, dto.RequiredStaff);
            Assert.Equal(_phasesDuration, dto.PhasesDuration);
        }
    }
}