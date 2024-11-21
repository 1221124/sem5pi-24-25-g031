using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.OperationTypes;
using Domain.Shared;
using Moq;
using Xunit;

namespace DDDNetCore.Tests.Unit.Domain.OperationTypes
{
    public class OperationTypeServiceUnitTest
    {
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<IOperationTypeRepository> _mockRepo;
        private readonly OperationTypeService _service;

        public OperationTypeServiceUnitTest()
        {
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockRepo = new Mock<IOperationTypeRepository>();
            _service = new OperationTypeService(_mockUnitOfWork.Object, _mockRepo.Object);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnListOfOperationTypeDtos()
        {
            // Arrange
            var operationTypes = new List<OperationType>
            {
                new OperationType(Guid.NewGuid(), new Name("Operation 1"), Specialization.CARDIOLOGY, new List<RequiredStaff>(), new PhasesDuration(), Status.Active),
                new OperationType(Guid.NewGuid(), new Name("Operation 2"), Specialization.ANAESTHESIOLOGY, new List<RequiredStaff>(), new PhasesDuration(), Status.Inactive)
            };
            _mockRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(operationTypes);

            // Act
            var result = await _service.GetAllAsync();

            // Assert
            Assert.Equal(2, result.Count);
            _mockRepo.Verify(repo => repo.GetAllAsync(), Times.Once);
        }

        [Fact]
        public async Task GetByNameAsync_ShouldReturnOperationTypeDto_WhenExists()
        {
            // Arrange
            var name = new Name("Operation 1");
            var operationType = new OperationType(Guid.NewGuid(), name, Specialization.CARDIOLOGY, new List<RequiredStaff>(), new PhasesDuration(), Status.Active);
            _mockRepo.Setup(repo => repo.GetByNameAsync(name)).ReturnsAsync(operationType);

            // Act
            var result = await _service.GetByNameAsync(name);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(name, result.Name);
            _mockRepo.Verify(repo => repo.GetByNameAsync(name), Times.Once);
        }

        [Fact]
        public async Task GetByNameAsync_ShouldReturnNull_WhenNotFound()
        {
            // Arrange
            var name = new Name("Nonexistent Operation");
            _mockRepo.Setup(repo => repo.GetByNameAsync(name)).ReturnsAsync((OperationType)null);

            // Act
            var result = await _service.GetByNameAsync(name);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task AddAsync_ShouldAddNewOperationTypeAndCommit()
        {
            // Arrange
            var dto = new CreatingOperationTypeDto(new Name("Operation 3"), Specialization.ORTHOPAEDICS, new List<RequiredStaff>(), new PhasesDuration());
            _mockRepo.Setup(repo => repo.GetByNameAsync(dto.Name)).ReturnsAsync((OperationType)null);

            // Act
            var result = await _service.AddAsync(dto);

            // Assert
            Assert.NotNull(result);
            _mockRepo.Verify(repo => repo.AddAsync(It.IsAny<OperationType>()), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task AddAsync_ShouldReturnNull_WhenOperationTypeExists()
        {
            // Arrange
            var dto = new CreatingOperationTypeDto(new Name("Duplicate Operation"), Specialization.CARDIOLOGY, new List<RequiredStaff>(), new PhasesDuration());
            var existingOperationType = new OperationType(Guid.NewGuid(), dto.Name, dto.Specialization, dto.RequiredStaff, dto.PhasesDuration, Status.Active);
            _mockRepo.Setup(repo => repo.GetByNameAsync(dto.Name)).ReturnsAsync(existingOperationType);

            // Act
            var result = await _service.AddAsync(dto);

            // Assert
            Assert.Null(result);
            _mockRepo.Verify(repo => repo.AddAsync(It.IsAny<OperationType>()), Times.Never);
            _mockUnitOfWork.Verify(uow => uow.CommitAsync(), Times.Never);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateOperationTypeAndCommit()
        {
            // Arrange
            var dto = new OperationTypeDto { Id = Guid.NewGuid(), Name = new Name("Updated Operation"), Status = Status.Inactive };
            var operationType = new OperationType(dto.Id, dto.Name, Specialization.CARDIOLOGY, new List<RequiredStaff>(), new PhasesDuration(), Status.Active);
            _mockRepo.Setup(repo => repo.GetByIdAsync(It.IsAny<OperationTypeId>())).ReturnsAsync(operationType);

            // Act
            var result = await _service.UpdateAsync(dto);

            // Assert
            Assert.NotNull(result);
            _mockUnitOfWork.Verify(uow => uow.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnNull_WhenOperationTypeNotFound()
        {
            // Arrange
            var dto = new OperationTypeDto { Id = Guid.NewGuid(), Name = new Name("Nonexistent Operation") };
            _mockRepo.Setup(repo => repo.GetByIdAsync(It.IsAny<OperationTypeId>())).ReturnsAsync((OperationType)null);

            // Act
            var result = await _service.UpdateAsync(dto);

            // Assert
            Assert.Null(result);
            _mockUnitOfWork.Verify(uow => uow.CommitAsync(), Times.Never);
        }

        [Fact]
        public async Task InactivateAsync_ShouldChangeStatusAndCommit()
        {
            // Arrange
            var id = new OperationTypeId(Guid.NewGuid());
            var operationType = new OperationType(id.AsGuid(), new Name("Operation 1"), Specialization.CARDIOLOGY, new List<RequiredStaff>(), new PhasesDuration(), Status.Active);
            _mockRepo.Setup(repo => repo.GetByIdAsync(id)).ReturnsAsync(operationType);

            // Act
            var result = await _service.InactivateAsync(id);

            // Assert
            Assert.NotNull(result);
            _mockUnitOfWork.Verify(uow => uow.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task InactivateAsync_ShouldReturnNull_WhenOperationTypeNotFound()
        {
            // Arrange
            var id = new OperationTypeId(Guid.NewGuid());
            _mockRepo.Setup(repo => repo.GetByIdAsync(id)).ReturnsAsync((OperationType)null);

            // Act
            var result = await _service.InactivateAsync(id);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task DeleteAsync_ShouldRemoveAndCommit()
        {
            // Arrange
            var id = new OperationTypeId(Guid.NewGuid());
            var operationType = new OperationType(id.AsGuid(), new Name("Operation to Delete"), Specialization.CARDIOLOGY, new List<RequiredStaff>(), new PhasesDuration(), Status.Inactive);
            _mockRepo.Setup(repo => repo.GetByIdAsync(id)).ReturnsAsync(operationType);

            // Act
            var result = await _service.DeleteAsync(id);

            // Assert
            Assert.NotNull(result);
            _mockRepo.Verify(repo => repo.Remove(operationType), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnNull_WhenOperationTypeNotFound()
        {
            // Arrange
            var id = new OperationTypeId(Guid.NewGuid());
            _mockRepo.Setup(repo => repo.GetByIdAsync(id)).ReturnsAsync((OperationType)null);

            // Act
            var result = await _service.DeleteAsync(id);

            // Assert
            Assert.Null(result);
            _mockRepo.Verify(repo => repo.Remove(It.IsAny<OperationType>()), Times.Never);
            _mockUnitOfWork.Verify(uow => uow.CommitAsync(), Times.Never);
        }

        [Fact]
        public void CheckIfOperationTypeIsActive_ShouldReturnTrue_WhenStatusIsActive()
        {
            // Arrange
            var dto = new OperationTypeDto { Status = Status.Active };

            // Act
            var result = _service.CheckIfOperationTypeIsActive(dto);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void CheckIfOperationTypeIsActive_ShouldReturnFalse_WhenStatusIsNotActive()
        {
            // Arrange
            var dto = new OperationTypeDto { Status = Status.Inactive };

            // Act
            var result = _service.CheckIfOperationTypeIsActive(dto);

            // Assert
            Assert.False(result);
        }
    }
}
