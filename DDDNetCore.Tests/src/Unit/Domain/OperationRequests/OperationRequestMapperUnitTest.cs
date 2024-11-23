using Domain.Patients;
using Domain.Shared;
using Domain.Staffs;

namespace DDDNetCore.Tests.Unit.Domain.OperationRequests;

using Xunit;
using FluentAssertions;
using System;
using System.Collections.Generic;
using DDDNetCore.Domain.OperationRequests;


public class OperationRequestMapperTests
{
    [Fact]
    public void ToDto_ShouldMapOperationRequestToOperationRequestDto()
    {
        // Arrange
        var operationRequest = new OperationRequest(
            new Guid("11111111-1111-1111-1111-111111111111"),
            new LicenseNumber("staff1"),
            new MedicalRecordNumber("patient1"),
            new Name("operation1"),
            new DeadlineDate("2024-12-01"),
            Priority.URGENT,
            RequestStatus.PENDING,
            new RequestCode("req1")
        );

        // Act
        var dto = OperationRequestMapper.ToDto(operationRequest);

        // Assert
        dto.Id.Should().Be(operationRequest.Id.AsGuid());
        dto.Staff.Should().Be(operationRequest.Staff);
        dto.Patient.Should().Be(operationRequest.Patient);
        dto.OperationType.Should().Be(operationRequest.OperationType);
        dto.DeadlineDate.Should().Be(operationRequest.DeadlineDate);
        dto.Priority.Should().Be(operationRequest.Priority);
        dto.Status.Should().Be(operationRequest.Status);
    }

    [Fact]
    public void ToEntity_ShouldMapOperationRequestDtoToOperationRequest()
    {
        // Arrange
        var dto = new OperationRequestDto(
            new Guid("11111111-1111-1111-1111-111111111111"),
            new LicenseNumber("staff1"),
            new MedicalRecordNumber("patient1"),
            new Name("operation1"),
            new DeadlineDate("2024-12-01"),
            Priority.URGENT,
            RequestStatus.PENDING,
            new RequestCode("req1")
        );

        // Act
        var entity = OperationRequestMapper.ToEntity(dto);

        // Assert
        entity.Id.AsGuid().Should().Be(dto.Id);
        entity.Staff.Should().Be(dto.Staff);
        entity.Patient.Should().Be(dto.Patient);
        entity.OperationType.Should().Be(dto.OperationType);
        entity.DeadlineDate.Should().Be(dto.DeadlineDate);
        entity.Priority.Should().Be(dto.Priority);
        entity.Status.Should().Be(dto.Status);
    }

    [Fact]
    public void ToEntityFromCreating_ShouldMapCreatingOperationRequestDtoToOperationRequest()
    {
        // Arrange
        var dto = new CreatingOperationRequestDto
        (
            new LicenseNumber("staff2"),
            new MedicalRecordNumber("patient2"),
            new Name("operation2"),
            new DeadlineDate("2024-12-15"),
            Priority.EMERGENCY
        );

        // Act
        var entity = OperationRequestMapper.ToEntityFromCreating(dto);

        // Assert
        entity.Staff.Should().Be(dto.Staff);
        entity.Patient.Should().Be(dto.Patient);
        entity.OperationType.Should().Be(dto.OperationType);
        entity.DeadlineDate.Should().Be(dto.DeadlineDate);
        entity.Priority.Should().Be(dto.Priority);
    }

    [Fact]
    public void ToDtoList_ShouldMapListOfOperationRequestsToListOfDtos()
    {
        // Arrange
        var operationRequests = new List<OperationRequest>
        {
            new OperationRequest(
                new Guid("11111111-1111-1111-1111-111111111111"),
                new LicenseNumber("staff1"),
                new MedicalRecordNumber("patient1"),
                new Name("operation1"),
                new DeadlineDate("2024-12-01"),
                Priority.URGENT,
                RequestStatus.PENDING,
            new RequestCode("req1")
            ),
            new OperationRequest(
                new Guid("22222222-2222-2222-2222-222222222222"),
                new LicenseNumber("staff2"),
                new MedicalRecordNumber("patient2"),
                new Name("operation2"),
                new DeadlineDate("2024-12-15"),
                Priority.EMERGENCY,
                RequestStatus.ACCEPTED,
            new RequestCode("req1")
            )
        };

        // Act
        var dtos = OperationRequestMapper.ToDtoList(operationRequests);

        // Assert
        dtos.Should().HaveCount(2);
        dtos[0].Id.Should().Be(operationRequests[0].Id.AsGuid());
        dtos[1].Id.Should().Be(operationRequests[1].Id.AsGuid());
    }

    [Fact]
    public void ToEntityList_ShouldMapListOfDtosToListOfOperationRequests()
    {
        // Arrange
        var dtoList = new List<OperationRequestDto>
        {
            new OperationRequestDto
            {
                Id = new Guid("11111111-1111-1111-1111-111111111111"),
                Staff = new LicenseNumber("staff1"),
                Patient = new MedicalRecordNumber("patient1"),
                OperationType = new Name("operation1"),
                DeadlineDate = new DeadlineDate("2024-12-01"),
                Priority = Priority.EMERGENCY,
                Status = RequestStatus.PENDING
            },
            new OperationRequestDto
            {
                Id = new Guid("22222222-2222-2222-2222-222222222222"),
                Staff = new LicenseNumber("staff2"),
                Patient = new MedicalRecordNumber("patient2"),
                OperationType = new Name("operation2"),
                DeadlineDate = new DeadlineDate("2024-12-15"),
                Priority = Priority.URGENT,
                Status = RequestStatus.ACCEPTED
            }
        };

        // Act
        var entities = OperationRequestMapper.ToEntityList(dtoList);

        // Assert
        entities.Should().HaveCount(2);
        entities[0].Id.AsGuid().Should().Be(dtoList[0].Id);
        entities[1].Id.AsGuid().Should().Be(dtoList[1].Id);
    }
}
