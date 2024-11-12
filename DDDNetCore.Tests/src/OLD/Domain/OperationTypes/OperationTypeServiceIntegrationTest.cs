using Xunit;
using System.Threading.Tasks;
using Domain.Shared;
using Microsoft.Extensions.DependencyInjection;
using Domain.OperationTypes;
using Infrastructure.OperationTypes;
using DDDNetCore.Tests.Infrastructure;
using System.Collections.Generic;

namespace DDDNetCore.Tests.Domain.OperationTypes
{
    public class OperationTypeServiceIntegrationTest : IClassFixture<TestDatabaseFixture>
    {
         private readonly OperationTypeService _OperationTypeService;
        private readonly TestDbContext _context;

        public OperationTypeServiceIntegrationTest(TestDatabaseFixture fixture)
        {
            _context = fixture.Context;
            fixture.Reset();

            var serviceCollection = new ServiceCollection();

            serviceCollection.AddTransient<IOperationTypeRepository, OperationTypeRepository>(provider =>
                new OperationTypeRepository(_context));

            serviceCollection.AddTransient<IUnitOfWork, TestUnitOfWork>(provider =>
                new TestUnitOfWork(_context));

            serviceCollection.AddTransient<OperationTypeService>();

            var serviceProvider = serviceCollection.BuildServiceProvider();
            _OperationTypeService = serviceProvider.GetService<OperationTypeService>();
        }

        [Fact]
        public async Task Create_ShouldCreateOperationType_WhenAdminRegistersOperationTypeWithRoleAsync()
        {
            var creatingOperationTypeDto = new CreatingOperationTypeDto("ACL", Specialization.ANAESTHESIOLOGY, new List<RequiredStaff>
            {
                new RequiredStaff(Role.Doctor, Specialization.CARDIOLOGY, 1),
                new RequiredStaff(Role.Nurse, Specialization.CARDIOLOGY, 2)
            },
            new PhasesDuration(new Dictionary<Phase, Quantity>
            {
                { Phase.Preparation, new Quantity(30) },
                { Phase.Surgery, new Quantity(120) },
                { Phase.Cleaning, new Quantity(60) }
            }));

            var OperationType = await _OperationTypeService.AddAsync(creatingOperationTypeDto);
            await _context.SaveChangesAsync();

            var OperationTypes = await _OperationTypeService.GetAllAsync();
            var addedOperationType = await _OperationTypeService.GetByNameAsync(new Name("ACL"));

            Assert.NotNull(addedOperationType);
            Assert.Equal(new Name("ACL"), OperationType.Name);

            Assert.Single(OperationTypes);
            Assert.Equal(addedOperationType.Name, OperationType.Name);
            Assert.Equal(addedOperationType.Specialization, OperationType.Specialization);
            Assert.Equal(addedOperationType.RequiredStaff, OperationType.RequiredStaff);
            Assert.Equal(addedOperationType.PhasesDuration, OperationType.PhasesDuration);
        }

        [Fact]
        public async Task Create_NotRegistered_WhenOperationTypeAlreadyExistsAsync()
        {
            var creatingOperationTypeDto = new CreatingOperationTypeDto("ACL", Specialization.ANAESTHESIOLOGY, new List<RequiredStaff>
            {
                new RequiredStaff(Role.Doctor, Specialization.CARDIOLOGY, 1),
                new RequiredStaff(Role.Nurse, Specialization.CARDIOLOGY, 2)
            },
            new PhasesDuration(new Dictionary<Phase, Quantity>
            {
                { Phase.Preparation, new Quantity(30) },
                { Phase.Surgery, new Quantity(120) },
                { Phase.Cleaning, new Quantity(60) }
            }));

            await _OperationTypeService.AddAsync(creatingOperationTypeDto);
            await _context.SaveChangesAsync();

            await _OperationTypeService.AddAsync(creatingOperationTypeDto);
            await _context.SaveChangesAsync();

            var OperationTypes = await _OperationTypeService.GetAllAsync();

            Assert.Single(OperationTypes);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsOperationType_WhenIdExists()
        {
            var creatingOperationTypeDto = new CreatingOperationTypeDto("ACL", Specialization.ANAESTHESIOLOGY, new List<RequiredStaff>
            {
                new RequiredStaff(Role.Doctor, Specialization.CARDIOLOGY, 1),
                new RequiredStaff(Role.Nurse, Specialization.CARDIOLOGY, 2)
            },
            new PhasesDuration(new Dictionary<Phase, Quantity>
            {
                { Phase.Preparation, new Quantity(30) },
                { Phase.Surgery, new Quantity(120) },
                { Phase.Cleaning, new Quantity(60) }
            }));
            var createdOperationType = await _OperationTypeService.AddAsync(creatingOperationTypeDto);
            await _context.SaveChangesAsync();

            var OperationTypeId = createdOperationType.Id;
            var OperationType = await _OperationTypeService.GetByIdAsync(new OperationTypeId(OperationTypeId));

            Assert.NotNull(OperationType);
            Assert.Equal(createdOperationType.Name, OperationType.Name);
            Assert.Equal(createdOperationType.Specialization, OperationType.Specialization);
            Assert.Equal(createdOperationType.RequiredStaff, OperationType.RequiredStaff);
            Assert.Equal(createdOperationType.PhasesDuration, OperationType.PhasesDuration);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsAllOperationTypes()
        {
            var creatingOperationTypeDto1 = new CreatingOperationTypeDto("ACL", Specialization.ANAESTHESIOLOGY, new List<RequiredStaff>
            {
                new RequiredStaff(Role.Doctor, Specialization.CARDIOLOGY, 1),
                new RequiredStaff(Role.Nurse, Specialization.CARDIOLOGY, 2)
            },
            new PhasesDuration(new Dictionary<Phase, Quantity>
            {
                { Phase.Preparation, new Quantity(30) },
                { Phase.Surgery, new Quantity(120) },
                { Phase.Cleaning, new Quantity(60) }
            }));

            var creatingOperationTypeDto2 = new CreatingOperationTypeDto("Knee", Specialization.ANAESTHESIOLOGY, new List<RequiredStaff>
            {
                new RequiredStaff(Role.Doctor, Specialization.CARDIOLOGY, 1),
                new RequiredStaff(Role.Nurse, Specialization.CARDIOLOGY, 2)
            },
            new PhasesDuration(new Dictionary<Phase, Quantity>
            {
                { Phase.Preparation, new Quantity(30) },
                { Phase.Surgery, new Quantity(120) },
                { Phase.Cleaning, new Quantity(60) }
            }));

            await _OperationTypeService.AddAsync(creatingOperationTypeDto1);
            await _context.SaveChangesAsync();
            await _OperationTypeService.AddAsync(creatingOperationTypeDto2);
            await _context.SaveChangesAsync();

            var OperationTypes = await _OperationTypeService.GetAllAsync();

            Assert.NotNull(OperationTypes);
            Assert.Equal(2, OperationTypes.Count);
            Assert.Contains(OperationTypes, u => u.Name.Value == "ACL");
            Assert.Contains(OperationTypes, u => u.Name.Value == "Knee");
        }

        [Fact]
        public async Task InactivateAsync_InactivatesOperationTypeInDatabase()
        {
            var creatingOperationTypeDto = new CreatingOperationTypeDto("ACL", Specialization.ANAESTHESIOLOGY, new List<RequiredStaff>
            {
                new RequiredStaff(Role.Doctor, Specialization.CARDIOLOGY, 1),
                new RequiredStaff(Role.Nurse, Specialization.CARDIOLOGY, 2)
            },
            new PhasesDuration(new Dictionary<Phase, Quantity>
            {
                { Phase.Preparation, new Quantity(30) },
                { Phase.Surgery, new Quantity(120) },
                { Phase.Cleaning, new Quantity(60) }
            }));
            var createdOperationType = await _OperationTypeService.AddAsync(creatingOperationTypeDto);
            await _context.SaveChangesAsync();

            var OperationTypeId = createdOperationType.Id;
            await _OperationTypeService.InactivateAsync(new OperationTypeId(OperationTypeId));
            await _context.SaveChangesAsync();

            var OperationType = await _OperationTypeService.GetByIdAsync(new OperationTypeId(OperationTypeId));

            Assert.NotNull(OperationType);
            Assert.True(OperationType.Status == Status.Inactive);
        }

        [Fact]
        public async Task DeleteAsync_DeletesOperationTypeFromDatabase()
        {
            var creatingOperationTypeDto = new CreatingOperationTypeDto("ACL", Specialization.ANAESTHESIOLOGY, new List<RequiredStaff>
            {
                new RequiredStaff(Role.Doctor, Specialization.CARDIOLOGY, 1),
                new RequiredStaff(Role.Nurse, Specialization.CARDIOLOGY, 2)
            },
            new PhasesDuration(new Dictionary<Phase, Quantity>
            {
                { Phase.Preparation, new Quantity(30) },
                { Phase.Surgery, new Quantity(120) },
                { Phase.Cleaning, new Quantity(60) }
            }));
            var createdOperationType = await _OperationTypeService.AddAsync(creatingOperationTypeDto);
            await _context.SaveChangesAsync();

            var OperationTypeId = createdOperationType.Id;
            await _OperationTypeService.DeleteAsync(new OperationTypeId(OperationTypeId));
            await _context.SaveChangesAsync();

            var OperationType = await _OperationTypeService.GetByIdAsync(new OperationTypeId(OperationTypeId));

            Assert.Null(OperationType);
        }
    }
}