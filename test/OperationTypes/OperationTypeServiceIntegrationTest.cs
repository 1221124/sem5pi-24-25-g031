using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.OperationTypes;
using Domain.Shared;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace IntegrationTests
{
    public class OperationTypeServiceIntegrationTest : IDisposable
    {
        private readonly SARMDbContext _context;
        private readonly OperationTypeService _service;

        public OperationTypeServiceIntegrationTest()
        {
            // Configurar o DbContext para usar uma base de dados em memória
            var options = new DbContextOptionsBuilder<SARMDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new SARMDbContext(options);

            // Inicializar repositório e serviço
            var repository = new OperationTypeRepository(_context);
            _service = new OperationTypeService(new UnitOfWork(_context), repository);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task AddAsync_ShouldAddOperationType()
        {
            // Arrange
            var newOperationType = new CreatingOperationTypeDto
            {
                Name = "TestOperation",
                Specialization = Specialization.Orthopedics,
                RequiredStaff = new List<RequiredStaffDto> { new RequiredStaffDto { Role = "Doctor", Quantity = 1 } },
                PhasesDuration = 60
            };

            // Act
            var result = await _service.AddAsync(newOperationType);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("TestOperation", result.Name);
            Assert.Equal(Specialization.Orthopedics, result.Specialization);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnOperationType_WhenExists()
        {
            // Arrange
            var operationType = new OperationType(new Name("ExistingOperation"), Specialization.Cardiology, Status.Active);
            await _context.OperationTypes.AddAsync(operationType);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.GetByIdAsync(operationType.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("ExistingOperation", result.Name);
            Assert.Equal(Specialization.Cardiology, result.Specialization);
        }

        [Fact]
        public async Task GetByNameAsync_ShouldReturnOperationType_WhenExists()
        {
            // Arrange
            var operationType = new OperationType(new Name("UniqueName"), Specialization.Neurology, Status.Active);
            await _context.OperationTypes.AddAsync(operationType);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.GetByNameAsync(new Name("UniqueName"));

            // Assert
            Assert.NotNull(result);
            Assert.Equal("UniqueName", result.Name);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateOperationType()
        {
            // Arrange
            var operationType = new OperationType(new Name("UpdatableOperation"), Specialization.Pediatrics, Status.Active);
            await _context.OperationTypes.AddAsync(operationType);
            await _context.SaveChangesAsync();

            var updatedDto = new OperationTypeDto
            {
                Id = operationType.Id,
                Name = "UpdatedOperation",
                Specialization = Specialization.Orthopedics,
                RequiredStaff = new List<RequiredStaffDto> { new RequiredStaffDto { Role = "Nurse", Quantity = 2 } },
                PhasesDuration = 90
            };

            // Act
            var result = await _service.UpdateAsync(updatedDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("UpdatedOperation", result.Name);
            Assert.Equal(Specialization.Orthopedics, result.Specialization);
        }

        [Fact]
        public async Task InactivateAsync_ShouldSetStatusToInactive()
        {
            // Arrange
            var operationType = new OperationType(new Name("InactivatableOperation"), Specialization.Gynecology, Status.Active);
            await _context.OperationTypes.AddAsync(operationType);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.InactivateAsync(operationType.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(Status.Inactive, result.Status);
        }

        [Fact]
        public async Task DeleteAsync_ShouldRemoveOperationType()
        {
            // Arrange
            var operationType = new OperationType(new Name("DeletableOperation"), Specialization.Urology, Status.Active);
            await _context.OperationTypes.AddAsync(operationType);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.DeleteAsync(operationType.Id);

            // Assert
            var deletedOperationType = await _context.OperationTypes.FindAsync(operationType.Id);
            Assert.Null(deletedOperationType);
        }
    }
}
