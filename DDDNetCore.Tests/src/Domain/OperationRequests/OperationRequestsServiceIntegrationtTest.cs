using System;
using System.Threading.Tasks;
using DDDNetCore.Domain.Patients;
using DDDNetCore.Infrastructure.Patients;
using DDDNetCore.Tests.Infrastructure;
using Domain.OperationRequests;
using Domain.Shared;
using Domain.Patients;
using Domain.OperationTypes;
using Domain.Staffs;
using Infrastructure.OperationRequests;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace DDDNetCore.Tests.Domain.OperationRequests
{
    public class OperationRequestsServiceIntegrationTest : IClassFixture<TestDatabaseFixture>
    {
        private readonly OperationRequestService _service;
        private readonly TestDbContext _context;

        private readonly Guid _doctorId = Guid.NewGuid();
        private readonly Guid _patientId = Guid.NewGuid();
        private readonly Guid _operationTypeId = Guid.NewGuid();

        public OperationRequestsServiceIntegrationTest(TestDatabaseFixture fixture)
        {
            _context = fixture.Context;
            fixture.Reset();

            var serviceCollection = new ServiceCollection();

            serviceCollection.AddTransient<IOperationRequestRepository, OperationRequestRepository>(provider =>
                new OperationRequestRepository(_context));
            
            serviceCollection.AddTransient<IUnitOfWork, TestUnitOfWork>(provider =>
                new TestUnitOfWork(_context));

            serviceCollection.AddTransient<OperationRequestService>();
            
            var serviceProvider = serviceCollection.BuildServiceProvider();
            _service = serviceProvider.GetService<OperationRequestService>();
        }

        // [Fact]
        // public async Task AddOperationRequest_ShouldReturnDto_WhenSuccessful()
        // {
        //     var requestDto = new CreatingOperationRequestDto(
        //         new StaffId(_doctorId),
        //         new PatientId(_patientId),
        //         new OperationTypeId(_operationTypeId),
        //         new DeadlineDate(),
        //         Priority.URGENT
        //     );
        //
        //     var result = await _service.AddAsync(requestDto);
        //
        //     Assert.NotNull(result);
        //     Assert.Equal(requestDto.PatientId, result.PatientId);
        // }

        // [Fact]
        // public async Task GetByIdAsync_ShouldReturnDto_WhenOperationRequestExists()
        // {
        //     var requestId = await CreateTestOperationRequest();
        //
        //     var result = await _service.GetByIdAsync(new OperationRequestId(requestId));
        //
        //     Assert.NotNull(result);
        //     Assert.Equal(requestId, result.Id);
        // }

        // [Fact]
        // public async Task GetByIdAsync_ShouldReturnNull_WhenOperationRequestDoesNotExist()
        // {
        //     var result = await _service.GetByIdAsync(new OperationRequestId(Guid.NewGuid()));
        //
        //     Assert.Null(result);
        // }

        // [Fact]
        // public async Task UpdateAsync_ShouldReturnUpdatedDto_WhenUpdateIsSuccessful()
        // {
        //     var requestId = await CreateTestOperationRequest(); // Create a test operation request
        //
        //     var updateDto = new UpdatingOperationRequestDto
        //     (
        //         requestId,
        //         new DeadlineDate(),
        //         Priority.URGENT,
        //         RequestStatus.PENDING
        //     );
        //
        //     var result = await _service.UpdateAsync(updateDto);
        //
        //     Assert.NotNull(result);
        //     Assert.Equal(updateDto.DeadlineDate, result.DeadlineDate);
        //     Assert.Equal(updateDto.Priority, result.Priority);
        //     Assert.Equal(updateDto.RequestStatus, result.Status);
        // }

        // [Fact]
        // public async Task DeleteAsync_ShouldReturnDto_WhenOperationRequestExists()
        // {
        //     var requestId = await CreateTestOperationRequest(); // Create a test operation request
        //
        //     var result = await _service.DeleteAsync(new OperationRequestId(requestId));
        //
        //     Assert.NotNull(result);
        //     Assert.Equal(requestId, result.Id);
        //
        //     // Verify that the operation request is indeed deleted
        //     var deletedResult = await _service.GetByIdAsync(new OperationRequestId(requestId));
        //     Assert.Null(deletedResult);
        // }

        // [Fact]
        // public async Task DeleteAsync_ShouldReturnNull_WhenOperationRequestDoesNotExist()
        // {
        //     var result = await _service.DeleteAsync(new OperationRequestId(Guid.NewGuid()));
        //
        //     Assert.Null(result);
        // }

        // [Fact]
        // public async Task GetAllAsync_ShouldReturnList_WhenOperationRequestsExist()
        // {
        //     await CreateTestOperationRequest(); // Create a test operation request
        //
        //     var result = await _service.GetAllAsync();
        //
        //     Assert.NotNull(result);
        //     Assert.NotEmpty(result);
        // }

        // [Fact]
        // public async Task GetAllAsync_ShouldReturnEmptyList_WhenNoOperationRequestsExist()
        // {
        //     var result = await _service.GetAllAsync();
        //
        //     Assert.NotNull(result);
        //     Assert.Empty(result);
        // }

        private async Task<Guid> CreateTestOperationRequest()
        {
            var requestDto = new CreatingOperationRequestDto
            (
                new StaffId(_doctorId),
                new PatientId(_patientId),
                new OperationTypeId(_operationTypeId),
                new DeadlineDate(),
                Priority.URGENT
            );

            var result = await _service.AddAsync(requestDto);
            return result?.Id ?? Guid.Empty;
        }
    }
} 