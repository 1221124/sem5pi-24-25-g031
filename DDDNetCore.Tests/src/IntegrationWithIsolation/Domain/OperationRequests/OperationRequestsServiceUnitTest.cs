using Xunit;
using Moq;
using Domain.Shared;
using DDDNetCore.Domain.Patients;
using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Tests.src.Infrastructure;


namespace DDDNetCore.Tests.src.IntegrationWithIsolation.Domain.OperationRequests
{
    public class OperationRequestsServiceUnitTest : IClassFixture<TestDatabaseFixture>
    {
        private readonly OperationRequestService _service;
        private readonly Mock<IOperationRequestRepository> _operationRequestRepositoryMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<PatientService> _patientServiceMock;

        public OperationRequestsServiceUnitTest(TestDatabaseFixture fixture)
        {
            _operationRequestRepositoryMock = new Mock<IOperationRequestRepository>();
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _patientServiceMock = new Mock<PatientService>();
        }

        // [Fact]
        // public async Task AddAsync_ShouldAddOperationRequest_WhenValidDtoIsProvided()
        // {
        //     var requestDto = new CreatingOperationRequestDto
        //     (
        //         new StaffId(Guid.NewGuid()),
        //         new PatientId(Guid.NewGuid()),
        //         new OperationTypeId(Guid.NewGuid()),
        //         new DeadlineDate(),
        //         Priority.URGENT
        //     );
        //     var operationRequest = new OperationRequest();
        //
        //     var result = await _service.AddAsync(requestDto);
        //
        //     Assert.NotNull(result);
        //     _operationRequestRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<OperationRequest>()), Times.Once);
        //     _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
        // }

        // [Fact]
        // public async Task GetByIdAsync_ShouldReturnOperationRequestDto_WhenValidIdIsProvided()
        // {
        //     var operationRequest = new OperationRequest();
        //     var operationRequestId = new OperationRequestId(operationRequest.Id);
        //
        //     _operationRequestRepositoryMock.Setup(repo => repo.GetByIdAsync(operationRequestId))
        //         .ReturnsAsync(operationRequest);
        //
        //     var result = await _service.GetByIdAsync(operationRequestId);
        //
        //     Assert.NotNull(result);
        //     _operationRequestRepositoryMock.Verify(repo => repo.GetByIdAsync(operationRequestId), Times.Once);
        // }

        // [Fact]
        // public async Task GetAllAsync_ShouldReturnListOfOperationRequestDto()
        // {
        //     var operationRequests = new List<OperationRequest>
        //     {
        //         new OperationRequest(),
        //         new OperationRequest()
        //     };
        //
        //     _operationRequestRepositoryMock.Setup(repo => repo.GetAllAsync())
        //         .ReturnsAsync(operationRequests);
        //
        //     var result = await _service.GetAllAsync();
        //
        //     Assert.NotNull(result);
        //     Assert.Equal(2, result.Count);
        //     _operationRequestRepositoryMock.Verify(repo => repo.GetAllAsync(), Times.Once);
        // }

        // [Fact]
        // public async Task DeleteAsync_ShouldReturnDeletedOperationRequestDto_WhenValidIdIsProvided()
        // {
        //     // Arrange
        //     var operationRequest = new OperationRequest();
        //     var operationRequestId = new OperationRequestId(operationRequest.Id);
        //
        //     _operationRequestRepositoryMock.Setup(repo => repo.GetByIdAsync(operationRequestId))
        //         .ReturnsAsync(operationRequest);
        //     _operationRequestRepositoryMock.Setup(repo => repo.Remove(operationRequest));
        //     _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.CompletedTask);
        //
        //     
        //     var result = await _service.DeleteAsync(operationRequestId);
        //
        //     
        //     Assert.NotNull(result);
        //     _operationRequestRepositoryMock.Verify(repo => repo.Remove(operationRequest), Times.Once);
        //     _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
        // }
    }
}