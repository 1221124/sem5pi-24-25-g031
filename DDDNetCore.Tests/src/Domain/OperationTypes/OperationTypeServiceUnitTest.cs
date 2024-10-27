using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.OperationTypes;
using Domain.Shared;
using Moq;
using Xunit;

namespace OperationTypes
{
    public class OperationTypeServiceUnitTest
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IOperationTypeRepository> _repoMock;
        private readonly OperationTypeService _service;

        public OperationTypeServiceUnitTest()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _repoMock = new Mock<IOperationTypeRepository>();
            _service = new OperationTypeService(_unitOfWorkMock.Object, _repoMock.Object);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnListOfOperationTypeDto()
        {
            // Arrange
            var operationTypes = new List<OperationType>
            {
                new OperationType(new OperationTypeId(Guid.NewGuid()), "Surgery", Specialization.General, Status.Active),
                new OperationType(new OperationTypeId(Guid.NewGuid()), "X-ray", Specialization.Radiology, Status.Active)
            };
            _repoMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(operationTypes);

            // Act
            var result = await _service.GetAllAsync();

            // Assert
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetByNameAsync_ShouldReturnOperationTypeDto_WhenNameExists()
        {
            // Arrange
            var name = new Name("Surgery");
            var operationType = new OperationType(new OperationTypeId(Guid.NewGuid()), name, Specialization.General, Status.Active);
            _repoMock.Setup(repo => repo.GetByNameAsync(name)).ReturnsAsync(operationType);

            // Act
            var result = await _service.GetByNameAsync(name);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Surgery", result.Name);
        }

        [Fact]
        public async Task GetByNameAsync_ShouldReturnNull_WhenNameDoesNotExist()
        {
            // Arrange
            var name = new Name("NonExistent");
            _repoMock.Setup(repo => repo.GetByNameAsync(name)).ReturnsAsync((OperationType)null);

            // Act
            var result = await _service.GetByNameAsync(name);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task AddAsync_ShouldAddOperationTypeAndCommit()
        {
            // Arrange
            var dto = new CreatingOperationTypeDto("MRI", Specialization.Radiology);
            var operationType = OperationTypeMapper.ToEntityFromCreating(dto);
            _repoMock.Setup(repo => repo.AddAsync(operationType)).Verifiable();
            _unitOfWorkMock.Setup(u => u.CommitAsync()).Verifiable();

            // Act
            var result = await _service.AddAsync(dto);

            // Assert
            _repoMock.Verify(repo => repo.AddAsync(It.IsAny<OperationType>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
            Assert.Equal("MRI", result.Name);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateOperationTypeAndCommit()
        {
            // Arrange
            var name = new Name("Surgery");
            var existingOperationType = new OperationType(new OperationTypeId(Guid.NewGuid()), name, Specialization.General, Status.Active);
            _repoMock.Setup(repo => repo.GetByNameAsync(name)).ReturnsAsync(existingOperationType);
            var dto = new OperationTypeDto
            {
                Name = "Surgery",
                Specialization = Specialization.Cardiology
            };

            // Act
            var result = await _service.UpdateAsync(dto);

            // Assert
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
            Assert.Equal(Specialization.Cardiology, result.Specialization);
        }

        [Fact]
        public async Task InactivateAsync_ShouldSetStatusToInactiveAndCommit()
        {
            // Arrange
            var id = new OperationTypeId(Guid.NewGuid());
            var operationType = new OperationType(id, "Surgery", Specialization.ANAESTHESIOLOGY, Status.Active);
            _repoMock.Setup(repo => repo.GetByIdAsync(id)).ReturnsAsync(operationType);

            // Act
            var result = await _service.InactivateAsync(id);

            // Assert
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
            Assert.Equal(Status.Inactive, result.Status);
        }

        [Fact]
        public async Task DeleteAsync_ShouldRemoveOperationTypeAndCommit()
        {
            // Arrange
            var id = new OperationTypeId(Guid.NewGuid());
            var operationType = new OperationType(id, "X-ray", Specialization.ANAESTHESIOLOGY, Status.Inactive);
            _repoMock.Setup(repo => repo.GetByIdAsync(id)).ReturnsAsync(operationType);

            // Act
            var result = await _service.DeleteAsync(id);

            // Assert
            _repoMock.Verify(repo => repo.Remove(It.IsAny<OperationType>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.CommitAsync(), Times.Once);
            Assert.Equal("X-ray", result.Name);
        }

        [Fact]
        public async Task DeleteAsync_ShouldThrowException_WhenOperationTypeIsActive()
        {
            // Arrange
            var id = new OperationTypeId(Guid.NewGuid());
            var operationType = new OperationType(id, "CT Scan", Specialization.Radiology, Status.Active);
            _repoMock.Setup(repo => repo.GetByIdAsync(id)).ReturnsAsync(operationType);

            // Act & Assert
            await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.DeleteAsync(id));
        }
    }
}