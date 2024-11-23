using Xunit;
using Moq;
using System.Threading.Tasks;
using DDDNetCore.Domain.OperationRequests;

using System;
using System.Collections.Generic;
using DDDNetCore.Domain.Patients;
using Domain.DbLogs;
using Domain.Emails;
using Domain.OperationTypes;
using Domain.Patients;
using Domain.Shared;
using Domain.Staffs;
using Domain.Users;
using Range = Moq.Range;

namespace DDDNetCore.Tests.Unit.Domain.OperationRequests;

public class OperationRequestServiceUnitTest
{
    // Operation Request Service
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly OperationRequestService _service;
    private readonly Mock<IOperationRequestRepository> _repoMock;

    // Log Service
    private readonly Mock<DbLogService> _logServiceMock;
    private readonly Mock<IDbLogRepository> _logRepo;
    
    // Staff Service
    private readonly Mock<StaffService> _staffServiceMock;
    private readonly Mock<IStaffRepository> _staffRepoMock;
    private readonly Mock<IUserRepository> _userRepoMock;
    
    // Patient Service
    private readonly Mock<PatientService> _patientServiceMock;
    private readonly Mock<IPatientRepository> _patientRepoMock;
    private readonly Mock<IEmailService> _emailServiceMock;
    
    // Operation Type Service
    private readonly Mock<OperationTypeService> _operationTypeServiceMock;
    private readonly Mock<IOperationTypeRepository> _operationTypeRepoMock;
    
    public OperationRequestServiceUnitTest()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _repoMock = new Mock<IOperationRequestRepository>();
        
        // DbLog Service
        _logRepo = new Mock<IDbLogRepository>();
        
        // Staff Service
        _userRepoMock = new Mock<IUserRepository>();
        _staffRepoMock = new Mock<IStaffRepository>();
        
        // Patient Service
        _patientRepoMock = new Mock<IPatientRepository>();
        _emailServiceMock = new Mock<IEmailService>();
        
        // Operation Type Service
        _operationTypeRepoMock = new Mock<IOperationTypeRepository>(); 
        
        //Constructors
        _logServiceMock = new Mock<DbLogService>(
            _logRepo.Object,
            _unitOfWorkMock.Object
        );

        _staffServiceMock = new Mock<StaffService>(
            _unitOfWorkMock.Object,
            _staffRepoMock.Object,
            _userRepoMock.Object,
            _logServiceMock.Object
        );

        _patientServiceMock = new Mock<PatientService>(
            _unitOfWorkMock.Object, 
            _patientRepoMock.Object,
            _logServiceMock.Object,
            _emailServiceMock.Object
        );
        
        _operationTypeServiceMock = new Mock<OperationTypeService>(
            _unitOfWorkMock.Object,
            _operationTypeRepoMock.Object
        );
        
        _service = new OperationRequestService(
            _unitOfWorkMock.Object,
            _repoMock.Object,
            _patientServiceMock.Object,
            _operationTypeServiceMock.Object,
            _logServiceMock.Object,
            _staffServiceMock.Object
        );
    }

    [Fact]
    public async Task AddAsync_ValidRequest_AddsToRepository()
    {
        // Arrange
        var creatingDto = new CreatingOperationRequestDto
        (
            new LicenseNumber("1234"),
            new MedicalRecordNumber("5678"),
            new Name("Surgery"),
            new DeadlineDate("2024-11-21"),
            Priority.URGENT
        );

        _repoMock.Setup(r => r.AddAsync(It.IsAny<OperationRequest>()))
            .ReturnsAsync((OperationRequest request) => request);

        _unitOfWorkMock.Setup(u => u.CommitAsync())
            .ReturnsAsync(1);

        // Act
        var result = await _service.AddAsync(creatingDto, new RequestCode("req1"));

        // Assert
        Assert.NotNull(result);
        
        // Verify repository interactions
        _repoMock.Verify(r => r.AddAsync(It.Is<OperationRequest>(
            or => or.Staff == creatingDto.Staff &&
                  or.Patient == creatingDto.Patient &&
                  or.OperationType == creatingDto.OperationType &&
                  or.DeadlineDate == creatingDto.DeadlineDate &&
                  or.Priority == creatingDto.Priority
        )), Times.Once);

        _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Between(2, 2, Range.Inclusive));
    }
    
    [Fact]
    public async Task GetAllAsync_ValidRequest_ReturnsAllOperationRequests()
    {
        // Arrange
        var id = new OperationRequestId(Guid.NewGuid());
        var operationRequests = new List<OperationRequest>
        {
            new OperationRequest(
                id,
                new LicenseNumber("1234"),
                new MedicalRecordNumber("5678"),
                new Name("Surgery"),
                new DeadlineDate("2024-11-21"),
                Priority.EMERGENCY,
                RequestStatus.ACCEPTED,
                new RequestCode("req1")
            )
        };

        _repoMock.Setup(r => r.GetAllAsync())
            .ReturnsAsync(operationRequests);

        // Act
        var result = await _service.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Single(result);
        _repoMock.Verify(r => r.GetAllAsync(), Times.Once);
    }
    
    [Fact]
    public async Task DeleteAsync_ValidId_DeletesFromRepository()
    {
        // Arrange
        var id = new OperationRequestId(Guid.NewGuid());
        var operationRequest = new OperationRequest(
            id,
            new LicenseNumber("1234"),
            new MedicalRecordNumber("5678"),
            new Name("Surgery"),
            new DeadlineDate("2024-11-21"),
            Priority.EMERGENCY,
            RequestStatus.REJECTED,
            new RequestCode("req1")
        );

        _repoMock.Setup(r => r.GetByIdAsync(It.IsAny<OperationRequestId>()))
            .ReturnsAsync(operationRequest);
        

        // Act
        var result = await _service.DeleteAsync(id);

        // Assert
        Assert.NotNull(result);
        _repoMock.Verify(r => r.Remove(operationRequest), Times.Once);
        _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Between(2, 2, Range.Inclusive));
    }
    
    // [Fact]
    // public async Task GetFilteredAsync_ValidFilters_ReturnsFilteredResults()
    // {
    //     // Arrange
    //     var id = Guid.NewGuid();
    //     
    //     var operationRequests = new List<OperationRequestDto>
    //     {
    //         new OperationRequestDto { Id = id, Staff = new LicenseNumber("1234"), Patient = new MedicalRecordNumber("5678") }
    //     };
    //
    //     _repoMock.Setup(r => r.GetAllAsync())
    //         .ReturnsAsync(operationRequests.Select(OperationRequestMapper.ToEntity).ToList());
    //     
    //     _staffServiceMock.Setup(s => s.GetByLicenseNumber(It.IsAny<string>()))
    //         .ReturnsAsync(new StaffDto { LicenseNumber = new LicenseNumber("1234") });
    //
    //     // Act
    //     var result = await _service.GetFilteredAsync(
    //         id.ToString(), (new LicenseNumber("1234")).ToString(),
    //         null, null, null, null, null
    //         );
    //
    //     // Assert
    //     Assert.NotNull(result);
    //     Assert.Single(result);
    //     Assert.Equal(id, result[0].Id);
    // }
}
    