using Xunit;
using System;
using System.Collections.Generic;
using Domain.OperationTypes;
using Domain.Shared;

namespace DDDNetCore.Tests.src.Unit.Domain.OperationTypes
{
    public class OperationTypeUnitTest
    {
        private readonly Name _name;
        private readonly Specialization _specialization;
        private readonly List<RequiredStaff> _requiredStaff;
        private readonly PhasesDuration _phasesDuration;
        private readonly Status _status;

        public OperationTypeUnitTest()
        {
            _name = new Name("Example Operation");
            _specialization = Specialization.CARDIOLOGY;
            _requiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(Role.Doctor, Specialization.CARDIOLOGY, new Quantity(1)),
                new RequiredStaff(Role.Nurse, Specialization.ANAESTHESIOLOGY, new Quantity(2))
            };
            _phasesDuration = new PhasesDuration(30, 60, 20);
            _status = Status.Active;
        }

        [Fact]
        public void Constructor_WithAllParameters_ShouldInitializeProperties()
        {
            var id = Guid.NewGuid();
            var operationType = new OperationType(id, _name, _specialization, _requiredStaff, _phasesDuration, _status);

            Assert.Equal(new OperationTypeId(id), operationType.Id);
            Assert.Equal(_name, operationType.Name);
            Assert.Equal(_specialization, operationType.Specialization);
            Assert.Equal(_requiredStaff, operationType.RequiredStaff);
            Assert.Equal(_phasesDuration, operationType.PhasesDuration);
            Assert.Equal(_status, operationType.Status);
        }

        [Fact]
        public void Constructor_WithoutId_ShouldGenerateNewIdAndSetStatusToActive()
        {
            var operationType = new OperationType(_name, _specialization, _requiredStaff, _phasesDuration);

            Assert.NotEmpty(operationType.Id.Value);
            Assert.Equal(_name, operationType.Name);
            Assert.Equal(_specialization, operationType.Specialization);
            Assert.Equal(_requiredStaff, operationType.RequiredStaff);
            Assert.Equal(_phasesDuration, operationType.PhasesDuration);
            Assert.Equal(Status.Active, operationType.Status);
        }

        [Fact]
        public void Constructor_WithStringParameters_ShouldInitializeCorrectly()
        {
            var requiredStaffStrings = new List<string> { "Doctor,Cardiology,1", "Nurse,General,2" };
            var phasesDurationStrings = new List<string> { "PREPARATION:30", "SURGERY:60", "CLEANING:20" };
            var operationType = new OperationType("Example Operation", "Cardiology", requiredStaffStrings, phasesDurationStrings);

            Assert.NotEmpty(operationType.Id.Value);
            Assert.Equal("Example Operation", operationType.Name.Value);
            Assert.Equal(Specialization.CARDIOLOGY, operationType.Specialization);
            Assert.Equal(Status.Active, operationType.Status);
            Assert.Equal(1, operationType.RequiredStaff[0].Quantity.Value);
            Assert.Equal(Role.Doctor, operationType.RequiredStaff[0].Role);
            Assert.Equal(Specialization.CARDIOLOGY, operationType.RequiredStaff[0].Specialization);
            Assert.Equal(30, operationType.PhasesDuration.Preparation.Value);
            Assert.Equal(60, operationType.PhasesDuration.Surgery.Value);
            Assert.Equal(20, operationType.PhasesDuration.Cleaning.Value);
        }

        [Fact]
        public void Constructor_ShouldThrowArgumentNullException_WhenNameIsNull()
        {
            Assert.Throws<ArgumentNullException>(() =>
                new OperationType(Guid.NewGuid(), null, _specialization, _requiredStaff, _phasesDuration, _status));
        }

        [Fact]
        public void Constructor_ShouldThrowArgumentNullException_WhenPhasesDurationIsNull()
        {
            Assert.Throws<ArgumentNullException>(() =>
                new OperationType(Guid.NewGuid(), _name, _specialization, _requiredStaff, null, _status));
        }

        [Fact]
        public void Constructor_ShouldThrowArgumentNullException_WhenRequiredStaffIsNull()
        {
            Assert.Throws<ArgumentNullException>(() =>
                new OperationType(Guid.NewGuid(), _name, _specialization, null, _phasesDuration, _status));
        }

        [Fact]
        public void Constructor_ShouldSetDefaultStatusToActive_IfNotProvided()
        {
            var operationType = new OperationType(_name, _specialization, _requiredStaff, _phasesDuration);
            Assert.Equal(Status.Active, operationType.Status);
        }

        [Fact]
        public void PropertyAssignments_ShouldWorkCorrectly()
        {
            var operationType = new OperationType(_name, _specialization, _requiredStaff, _phasesDuration);
            var newName = new Name("Updated Operation");
            var newSpecialization = Specialization.ORTHOPAEDICS;
            var newRequiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(Role.Technician, Specialization.ORTHOPAEDICS, new Quantity(1))
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
