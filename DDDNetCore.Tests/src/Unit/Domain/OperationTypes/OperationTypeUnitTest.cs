using Xunit;
using System;
using System.Collections.Generic;
using Domain.OperationTypes;
using Domain.Shared;

namespace DDDNetCore.Tests.src.Unit.Domain.OperationTypes
{
    public class OperationTypeUnitTest
    {
        private readonly OperationTypeCode _code;
        private readonly Name _name;
        private readonly Specialization _specialization;
        private readonly List<RequiredStaff> _requiredStaff;
        private readonly PhasesDuration _phasesDuration;
        private readonly Status _status;

        public OperationTypeUnitTest()
        {
            _code = new OperationTypeCode("typ1");
            _name = new Name("Example Operation");
            _specialization = Specialization.CARDIOLOGY;
            _requiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(Role.Doctor, Specialization.CARDIOLOGY, new Quantity(1), false, true, false),
                new RequiredStaff(Role.Nurse, Specialization.ANAESTHESIOLOGY, new Quantity(2), false, true, false)
            };
            _phasesDuration = new PhasesDuration(30, 60, 20);
            _status = Status.Active;
        }

        [Fact]
        public void Constructor_WithAllParameters_ShouldInitializeProperties()
        {
            var id = Guid.NewGuid();
            var operationType = new OperationType(id, _code, _name, _specialization, _requiredStaff, _phasesDuration, _status);

            Assert.Equal(new OperationTypeId(id), operationType.Id);
            Assert.Equal(_code, operationType.OperationTypeCode);
            Assert.Equal(_name, operationType.Name);
            Assert.Equal(_specialization, operationType.Specialization);
            Assert.Equal(_requiredStaff, operationType.RequiredStaff);
            Assert.Equal(_phasesDuration, operationType.PhasesDuration);
            Assert.Equal(_status, operationType.Status);
        }

        [Fact]
        public void Constructor_WithoutId_ShouldGenerateNewIdAndSetStatusToActive()
        {
            var operationType = new OperationType(_code, _name, _specialization, _requiredStaff, _phasesDuration);

            Assert.NotEmpty(operationType.Id.Value);
            Assert.Equal(_code, operationType.OperationTypeCode);
            Assert.Equal(_name, operationType.Name);
            Assert.Equal(_specialization, operationType.Specialization);
            Assert.Equal(_requiredStaff, operationType.RequiredStaff);
            Assert.Equal(_phasesDuration, operationType.PhasesDuration);
            Assert.Equal(Status.Active, operationType.Status);
        }

        [Fact]
        public void Constructor_ShouldThrowArgumentNullException_WhenNameIsNull()
        {
            Assert.Throws<ArgumentNullException>(() =>
                new OperationType(Guid.NewGuid(), _code, null, _specialization, _requiredStaff, _phasesDuration, _status));
        }

        [Fact]
        public void Constructor_ShouldThrowArgumentNullException_WhenPhasesDurationIsNull()
        {
            Assert.Throws<ArgumentNullException>(() =>
                new OperationType(Guid.NewGuid(), _code, _name, _specialization, _requiredStaff, null, _status));
        }

        [Fact]
        public void Constructor_ShouldThrowArgumentNullException_WhenRequiredStaffIsNull()
        {
            Assert.Throws<ArgumentNullException>(() =>
                new OperationType(Guid.NewGuid(), _code, _name, _specialization, null, _phasesDuration, _status));
        }

        [Fact]
        public void Constructor_ShouldSetDefaultStatusToActive_IfNotProvided()
        {
            var operationType = new OperationType(_code, _name, _specialization, _requiredStaff, _phasesDuration);
            Assert.Equal(Status.Active, operationType.Status);
        }

        [Fact]
        public void PropertyAssignments_ShouldWorkCorrectly()
        {
            var operationType = new OperationType(_code, _name, _specialization, _requiredStaff, _phasesDuration);
            var newName = new Name("Updated Operation");
            var newSpecialization = Specialization.ORTHOPAEDICS;
            var newRequiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(Role.Technician, Specialization.ORTHOPAEDICS, new Quantity(1), false, true, false),
            };
            var newPhasesDuration = new PhasesDuration(40, 70, 30);
            var newStatus = Status.Inactive;

            operationType.Name = newName;
            operationType.Specialization = newSpecialization;
            operationType.RequiredStaff = newRequiredStaff;
            operationType.PhasesDuration = newPhasesDuration;
            operationType.Status = newStatus;

            Assert.Equal(newName, operationType.Name);
            Assert.Equal(newSpecialization, operationType.Specialization);
            Assert.Equal(newRequiredStaff, operationType.RequiredStaff);
            Assert.Equal(newPhasesDuration, operationType.PhasesDuration);
            Assert.Equal(newStatus, operationType.Status);
        }
    }
}
