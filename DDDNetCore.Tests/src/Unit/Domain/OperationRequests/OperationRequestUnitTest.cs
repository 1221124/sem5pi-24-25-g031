using System;
using DDDNetCore.Domain.OperationRequests;
using Xunit;
using Domain.Staffs;
using Domain.Patients;
using Domain.Shared;
using FluentAssertions;

namespace DDDNetCore.Tests.Unit.Domain.OperationRequests{
    public class OperationRequestTests{
        [Fact]
        public void Constructor_ShouldInitializePropertiesCorrectly()
        {
            // Arrange
            var staff = new LicenseNumber("D123");
            var patient = new MedicalRecordNumber("P456");
            var operationType = new Name("Surgery");
            var deadlineDate = new DeadlineDate(DateTime.UtcNow.AddDays(7));
            var priority = Priority.ELECTIVE;
            var requestCode = new RequestCode("req1");

            // Act
            var operationRequest = new OperationRequest(staff, patient, operationType, deadlineDate, priority, requestCode);

            // Assert
            operationRequest.Staff.Should().Be(staff);
            operationRequest.Patient.Should().Be(patient);
            operationRequest.OperationType.Should().Be(operationType);
            operationRequest.DeadlineDate.Should().Be(deadlineDate);
            operationRequest.Priority.Should().Be(priority);
            operationRequest.Status.Should().Be(RequestStatus.PENDING);
        }

        [Fact]
        public void Constructor_WithNullDeadlineDate_ShouldThrowArgumentNullException()
        {
            // Arrange
            var staff = new LicenseNumber("D123");
            var patient = new MedicalRecordNumber("P456");
            var operationType = new Name("Surgery");
            Priority? priority = new Priority();
            var requestCode = new RequestCode("req1");

            // Act
            Action act = () => new OperationRequest(
                Guid.NewGuid(),
                staff,
                patient,
                operationType,
                null,
                priority,
                RequestStatus.PENDING,
                requestCode);

            // Assert
            act.Should().Throw<ArgumentNullException>().WithMessage("*deadlineDate*");
        }

        [Fact]
        public void Update_ShouldModifyProperties_WhenValuesAreProvided()
        {
            // Arrange
            var staff = new LicenseNumber("D123");
            var patient = new MedicalRecordNumber("P456");
            var operationType = new Name("Surgery");
            var deadlineDate = new DeadlineDate(DateTime.UtcNow.AddDays(7));
            var priority = Priority.URGENT;
            var requestCode = new RequestCode("req1");

            var operationRequest = new OperationRequest(staff, patient, operationType, deadlineDate, priority, requestCode);
            var newDeadlineDate = new DeadlineDate(DateTime.UtcNow.AddDays(14));
            var newPriority = Priority.EMERGENCY;
            var nemRequestStatus = RequestStatus.REJECTED;

            var updatedRequest = new OperationRequest
            {
                DeadlineDate = newDeadlineDate,
                Priority = newPriority,
                Status = nemRequestStatus
            };

            // Act
            operationRequest.Update(updatedRequest);

            // Assert
            operationRequest.DeadlineDate.Should().Be(newDeadlineDate);
            operationRequest.Priority.Should().Be(newPriority);
            operationRequest.Status.Should().Be(nemRequestStatus);
        }

        [Fact]
        public void Constructor_WithAllValidParameters_ShouldInitializeProperties()
        {
            // Arrange
            var id = Guid.NewGuid();
            var staff = new LicenseNumber("D123");
            var patient = new MedicalRecordNumber("P456");
            var operationType = new Name("Surgery");
            var deadlineDate = new DeadlineDate(DateTime.UtcNow.AddDays(7));
            var priority = Priority.URGENT;
            var status = RequestStatus.REJECTED;
            var requestCode = new RequestCode("req1");

            // Act
            var operationRequest = new OperationRequest(id, staff, patient, operationType, deadlineDate, priority, status, requestCode);

            // Assert
            operationRequest.Id.Value.Should().Be(id.ToString());
            operationRequest.Staff.Should().Be(staff);
            operationRequest.Patient.Should().Be(patient);
            operationRequest.OperationType.Should().Be(operationType);
            operationRequest.DeadlineDate.Should().Be(deadlineDate);
            operationRequest.Priority.Should().Be(priority);
            operationRequest.Status.Should().Be(status);
        }
    }
}
