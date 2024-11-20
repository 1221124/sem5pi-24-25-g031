using Xunit;
using System.Threading.Tasks;
using Domain.Shared;
using Moq;
using Microsoft.Extensions.DependencyInjection;
using Domain.OperationTypes;
using DDDNetCore.Tests.src.Infrastructure;
using System.Linq;
using System;
using System.Collections.Generic;

namespace DDDNetCore.Tests.src.IntegrationWithoutIsolation.Domain.OperationTypes
{
    public class OperationTypeServiceIntegrationWithoutIsolationTest : IClassFixture<TestDatabaseFixture>
    {
        private readonly OperationTypeService _OperationTypeService;
        private readonly Mock<IOperationTypeRepository> _OperationTypeRepositoryMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly TestDbContext _context;

        public OperationTypeServiceIntegrationWithoutIsolationTest(TestDatabaseFixture fixture)
        {
            _context = fixture.Context;
            fixture.Reset();

            var serviceCollection = new ServiceCollection();

            _OperationTypeRepositoryMock = new Mock<IOperationTypeRepository>();

            _OperationTypeRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<OperationType>()))
                .Callback((OperationType operationType) => _context.OperationTypes.Add(operationType))
                .ReturnsAsync((OperationType operationType) => operationType);

            _OperationTypeRepositoryMock.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(() => _context.OperationTypes.ToList());

            _OperationTypeRepositoryMock.Setup(repo => repo.GetByIdAsync(It.IsAny<OperationTypeId>()))
                .ReturnsAsync((OperationTypeId operationTypeId) => _context.OperationTypes.FirstOrDefault(u => u.Id == operationTypeId));

            _OperationTypeRepositoryMock.Setup(repo => repo.GetByNameAsync(It.IsAny<Name>()))
                .ReturnsAsync((Name name) => _context.OperationTypes.FirstOrDefault(u => u.Name.Value == name.Value));

            _OperationTypeRepositoryMock.Setup(repo => repo.GetBySpecializationAsync(It.IsAny<Specialization>()))
                .ReturnsAsync((Specialization specialization) => _context.OperationTypes.Where(u => u.Specialization == specialization).ToList());

            _OperationTypeRepositoryMock.Setup(repo => repo.GetByStatusAsync(It.IsAny<Status>()))
                .ReturnsAsync((Status status) => _context.OperationTypes.Where(u => u.Status == status).ToList());

            _OperationTypeRepositoryMock.Setup(repo => repo.Remove(It.IsAny<OperationType>()))
                .Callback((OperationType operationType) => _context.OperationTypes.Remove(operationType));

            serviceCollection.AddTransient<IOperationTypeRepository>(_ => _OperationTypeRepositoryMock.Object);

            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _unitOfWorkMock.Setup(uow => uow.CommitAsync())
                .Callback(() => _context.SaveChanges())
                .ReturnsAsync(1);
            serviceCollection.AddTransient<IUnitOfWork>(_ => _unitOfWorkMock.Object);

            serviceCollection.AddTransient<OperationTypeService>();

            var serviceProvider = serviceCollection.BuildServiceProvider();
            _OperationTypeService = serviceProvider.GetService<OperationTypeService>();
        }

        [Fact]
        public async Task Create_ShouldCreateOperationType_WhenAdminRegistersValidOperationTypeAsync()
        {
            var creatingOperationTypeDto = new CreatingOperationTypeDto(
                "ACL",
                Specialization.ANAESTHESIOLOGY,
                new List<RequiredStaff>
                {
                    new RequiredStaff(Role.Doctor, Specialization.CARDIOLOGY, 1),
                    new RequiredStaff(Role.Nurse, Specialization.CARDIOLOGY, 2)
                },
                new PhasesDuration(30, 120, 60));

            var OperationType = await _OperationTypeService.AddAsync(creatingOperationTypeDto);
            await _unitOfWorkMock.Object.CommitAsync();

            var OperationTypes = await _OperationTypeService.GetAllAsync();
            var addedOperationType = await _OperationTypeRepositoryMock.Object.GetByIdAsync(new OperationTypeId(OperationType.Id));

            Assert.NotNull(OperationType);
            Assert.Equal(new Name("ACL"), OperationType.Name);
            Assert.Equal(Specialization.ANAESTHESIOLOGY, OperationType.Specialization);
            Assert.Equal(2, OperationType.RequiredStaff.Count);
            Assert.Equal(30, OperationType.PhasesDuration.Preparation.Value);
            Assert.Equal(120, OperationType.PhasesDuration.Surgery.Value);
            Assert.Equal(60, OperationType.PhasesDuration.Cleaning.Value);

            
            Assert.Single(OperationTypes);
            Assert.Equal(addedOperationType.Name, OperationType.Name);
            Assert.Equal(addedOperationType.Specialization, OperationType.Specialization);
            Assert.Equal(addedOperationType.RequiredStaff.Count, OperationType.RequiredStaff.Count);
            Assert.Equal(addedOperationType.PhasesDuration.Preparation.Value, OperationType.PhasesDuration.Preparation.Value);
            Assert.Equal(addedOperationType.PhasesDuration.Surgery.Value, OperationType.PhasesDuration.Surgery.Value);
            Assert.Equal(addedOperationType.PhasesDuration.Cleaning.Value, OperationType.PhasesDuration.Cleaning.Value);
        }

        [Fact]
        public async Task Create_NotRegistered_WhenOperationTypeAlreadyExistsAsync()
        {
            var creatingOperationTypeDto = new CreatingOperationTypeDto("ACL", Specialization.ANAESTHESIOLOGY, new List<RequiredStaff>
            {
                new RequiredStaff(Role.Doctor, Specialization.CARDIOLOGY, 1),
                new RequiredStaff(Role.Nurse, Specialization.CARDIOLOGY, 2)
            },
            new PhasesDuration(30, 120, 60));

            await _OperationTypeService.AddAsync(creatingOperationTypeDto);
            await _unitOfWorkMock.Object.CommitAsync();

            await _OperationTypeService.AddAsync(creatingOperationTypeDto);
            await _unitOfWorkMock.Object.CommitAsync();

            var OperationTypes = await _OperationTypeService.GetAllAsync();

            Assert.Single(OperationTypes);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsEmpty_WhenNoOperationTypesExist()
        {
            var OperationTypes = await _OperationTypeService.GetAllAsync();

            Assert.Empty(OperationTypes);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsAllOperationTypes()
        {
            var OperationTypesList = new List<Name>
            {
                new Name("ACL"),
                new Name("Hip"),
                new Name("Knee")
            };

            for (int i = 0; i < OperationTypesList.Count; i++)
            {
                await _OperationTypeService.AddAsync(new CreatingOperationTypeDto(OperationTypesList[i], Specialization.ANAESTHESIOLOGY, new List<RequiredStaff>
            {
                new RequiredStaff(Role.Doctor, Specialization.CARDIOLOGY, 1),
                new RequiredStaff(Role.Nurse, Specialization.CARDIOLOGY, 2)
            },
            new PhasesDuration(30, 120, 60)));
                await _unitOfWorkMock.Object.CommitAsync();
            }

            var OperationTypes = await _OperationTypeService.GetAllAsync();

            OperationTypes = OperationTypes.OrderBy(u => u.Name.Value).ToList();

            Assert.Equal(3, OperationTypes.Count);

            Assert.Equal(OperationTypesList[0], OperationTypes[0].Name);
            Assert.Equal(OperationTypesList[1], OperationTypes[1].Name);
            Assert.Equal(OperationTypesList[2], OperationTypes[2].Name);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsNull_WhenOperationTypeDoesNotExist()
        {
            var nonExistentId = new OperationTypeId(Guid.NewGuid());

            var OperationType = await _OperationTypeService.GetByIdAsync(nonExistentId);

            Assert.Null(OperationType);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsOperationType_WhenIdExists()
        {
            var creatingOperationTypeDto = new CreatingOperationTypeDto("ACL", Specialization.ANAESTHESIOLOGY, new List<RequiredStaff>
            {
                new RequiredStaff(Role.Doctor, Specialization.CARDIOLOGY, 1),
                new RequiredStaff(Role.Nurse, Specialization.CARDIOLOGY, 2)
            },
            new PhasesDuration(30, 120, 60));
            var OperationType = await _OperationTypeService.AddAsync(creatingOperationTypeDto);
            await _unitOfWorkMock.Object.CommitAsync();

            var OperationTypeId = OperationType.Id;

            var result = await _OperationTypeService.GetByIdAsync(new OperationTypeId(OperationTypeId));

            Assert.NotNull(result);
            Assert.Equal(OperationType.Id, result.Id);
            Assert.Equal(OperationType.Name, result.Name);
            Assert.Equal(OperationType.Specialization, result.Specialization);
            Assert.Equal(OperationType.RequiredStaff.Count, result.RequiredStaff.Count);
            Assert.Equal(OperationType.PhasesDuration.Preparation.Value, result.PhasesDuration.Preparation.Value);
            Assert.Equal(OperationType.PhasesDuration.Surgery.Value, result.PhasesDuration.Surgery.Value);
            Assert.Equal(OperationType.PhasesDuration.Cleaning.Value, result.PhasesDuration.Cleaning.Value);
        }

        [Fact]
        public async Task DeleteAsync_DeletesOperationType_WhenOperationTypeExists()
        {
            var creatingOperationTypeDto = new CreatingOperationTypeDto("ACL", Specialization.ANAESTHESIOLOGY, new List<RequiredStaff>
            {
                new RequiredStaff(Role.Doctor, Specialization.CARDIOLOGY, 1),
                new RequiredStaff(Role.Nurse, Specialization.CARDIOLOGY, 2)
            },
            new PhasesDuration(30, 120, 60));
            var OperationType = await _OperationTypeService.AddAsync(creatingOperationTypeDto);
            await _unitOfWorkMock.Object.CommitAsync();

            var OperationTypeId = OperationType.Id;

            var previousOperationTypes = await _OperationTypeService.GetAllAsync();

            await _OperationTypeService.DeleteAsync(new OperationTypeId(OperationTypeId));
            await _unitOfWorkMock.Object.CommitAsync();

            var currentOperationTypes = await _OperationTypeService.GetAllAsync();

            Assert.Single(previousOperationTypes);
            Assert.Empty(currentOperationTypes);
            Assert.Null(await _OperationTypeService.GetByIdAsync(new OperationTypeId(OperationTypeId)));
        }

        [Fact]
        public async Task DeleteAsync_DoesNotDelete_WhenOperationTypeDoesNotExist()
        {
            var OperationTypeId = new OperationTypeId(Guid.NewGuid());

            var previousOperationTypes = await _OperationTypeService.GetAllAsync();

            await _OperationTypeService.DeleteAsync(OperationTypeId);
            await _unitOfWorkMock.Object.CommitAsync();

            var currentOperationTypes = await _OperationTypeService.GetAllAsync();

            Assert.Empty(previousOperationTypes);
            Assert.Empty(currentOperationTypes);
            Assert.Null(await _OperationTypeService.GetByIdAsync(OperationTypeId));
        }

        [Fact]
        public async Task InactivateAsync_InactivatesOperationType_WhenOperationTypeExists()
        {
            var creatingOperationTypeDto = new CreatingOperationTypeDto("ACL", Specialization.ANAESTHESIOLOGY, new List<RequiredStaff>
            {
                new RequiredStaff(Role.Doctor, Specialization.CARDIOLOGY, 1),
                new RequiredStaff(Role.Nurse, Specialization.CARDIOLOGY, 2)
            },
            new PhasesDuration(30, 120, 60));
            var OperationType = await _OperationTypeService.AddAsync(creatingOperationTypeDto);
            await _unitOfWorkMock.Object.CommitAsync();

            var OperationTypeId = OperationType.Id;

            var previousOperationTypes = await _OperationTypeService.GetAllAsync();

            await _OperationTypeService.InactivateAsync(new OperationTypeId(OperationTypeId));
            await _unitOfWorkMock.Object.CommitAsync();

            var currentOperationTypes = await _OperationTypeService.GetAllAsync();

            var inactivatedOperationType = await _OperationTypeService.GetByIdAsync(new OperationTypeId(OperationTypeId));

            Assert.NotNull(inactivatedOperationType);
            Assert.Equal(Status.Inactive, inactivatedOperationType.Status);

            Assert.Single(previousOperationTypes);
            Assert.Single(currentOperationTypes);
        }

        [Fact]
        public async Task InactivateAsync_DoesNotInactivate_WhenOperationTypeDoesNotExist()
        {
            var OperationTypeId = new OperationTypeId(Guid.NewGuid());

            var previousOperationTypes = await _OperationTypeService.GetAllAsync();

            await _OperationTypeService.InactivateAsync(OperationTypeId);
            await _unitOfWorkMock.Object.CommitAsync();

            var currentOperationTypes = await _OperationTypeService.GetAllAsync();

            var inactivatedOperationType = await _OperationTypeService.GetByIdAsync(OperationTypeId);

            Assert.Null(inactivatedOperationType);
            Assert.Empty(previousOperationTypes);
            Assert.Empty(currentOperationTypes);
        }

        [Fact]
        public async Task GetByNameAsync_ReturnsNull_WhenOperationTypeDoesNotExist()
        {
            var nonExistentName = new Name("ACL");

            var OperationType = await _OperationTypeService.GetByNameAsync(nonExistentName);

            Assert.Null(OperationType);
        }

        [Fact]
        public async Task GetByNameAsync_ReturnsOperationType_WhenNameExists()
        {
            var creatingOperationTypeDto = new CreatingOperationTypeDto("ACL", Specialization.ANAESTHESIOLOGY, new List<RequiredStaff>
            {
                new RequiredStaff(Role.Doctor, Specialization.CARDIOLOGY, 1),
                new RequiredStaff(Role.Nurse, Specialization.CARDIOLOGY, 2)
            },
            new PhasesDuration(30, 120, 60));
            var OperationType = await _OperationTypeService.AddAsync(creatingOperationTypeDto);
            await _unitOfWorkMock.Object.CommitAsync();

            var Name = OperationType.Name;

            var result = await _OperationTypeService.GetByNameAsync(Name);

            Assert.NotNull(result);
            Assert.Equal(OperationType.Id, result.Id);
            Assert.Equal(OperationType.Name, result.Name);
            Assert.Equal(OperationType.Specialization, result.Specialization);
            Assert.Equal(OperationType.RequiredStaff.Count, result.RequiredStaff.Count);
            Assert.Equal(OperationType.PhasesDuration.Preparation.Value, result.PhasesDuration.Preparation.Value);
            Assert.Equal(OperationType.PhasesDuration.Surgery.Value, result.PhasesDuration.Surgery.Value);
            Assert.Equal(OperationType.PhasesDuration.Cleaning.Value, result.PhasesDuration.Cleaning.Value);
        }
        
        [Fact]
        public async Task GetByStatusAsync_ReturnsEmpty_WhenOperationTypesDoNotExist()
        {
            var nonExistentStatus = Status.Active;

            var OperationType = await _OperationTypeService.GetByStatusAsync(nonExistentStatus);

            Assert.Empty(OperationType);
        }

        [Fact]
        public async Task GetByStatusAsync_ReturnsOperationType_WhenStatusExists()
        {
            var creatingOperationTypeDto = new CreatingOperationTypeDto("ACL", Specialization.ANAESTHESIOLOGY, new List<RequiredStaff>
            {
                new RequiredStaff(Role.Doctor, Specialization.CARDIOLOGY, 1),
                new RequiredStaff(Role.Nurse, Specialization.CARDIOLOGY, 2)
            },
            new PhasesDuration(30, 120, 60));
            var OperationType = await _OperationTypeService.AddAsync(creatingOperationTypeDto);
            await _unitOfWorkMock.Object.CommitAsync();

            var result = await _OperationTypeService.GetByStatusAsync(Status.Active);

            Assert.NotNull(result);
            for (int i = 0; i < result.Count; i++)
            {
                Assert.Equal(Status.Active, result[i].Status);
            }
        }

        [Fact]
        public async Task GetBySpecializationAsync_ReturnsEmpty_WhenOperationTypesDoNotExist()
        {
            var nonExistentSpecialization = Specialization.ANAESTHESIOLOGY;

            var OperationType = await _OperationTypeService.GetBySpecializationAsync(nonExistentSpecialization);

            Assert.Empty(OperationType);
        }

        [Fact]
        public async Task GetBySpecializationAsync_ReturnsOperationType_WhenSpecializationExists()
        {
            var creatingOperationTypeDto = new CreatingOperationTypeDto("ACL", Specialization.ANAESTHESIOLOGY, new List<RequiredStaff>
            {
                new RequiredStaff(Role.Doctor, Specialization.CARDIOLOGY, 1),
                new RequiredStaff(Role.Nurse, Specialization.CARDIOLOGY, 2)
            },
            new PhasesDuration(30, 120, 60));
            var OperationType = await _OperationTypeService.AddAsync(creatingOperationTypeDto);
            await _unitOfWorkMock.Object.CommitAsync();

            var result = await _OperationTypeService.GetBySpecializationAsync(Specialization.ANAESTHESIOLOGY);

            Assert.NotNull(result);
            for (int i = 0; i < result.Count; i++)
            {
                Assert.Equal(Specialization.ANAESTHESIOLOGY, result[i].Specialization);
            }
        }
    }
}