using DDDNetCore.Tests.Infrastructure;
using Domain.Shared;
using Domain.Staffs;
using Infrastructure.StaffRepository;
using Infrastructure.Staffs;
using Microsoft.Extensions.DependencyInjection;
using Xunit;
using System.Threading.Tasks;

namespace DDDNetCore.Tests.Domain.Staffs
{
    public class StaffServiceIntegrationTest : IClassFixture<TestDatabaseFixture>
    {
        private readonly StaffService _staffService;
        private readonly TestDbContext _context;

        public StaffServiceIntegrationTest(TestDatabaseFixture fixture)
        {
            _context = fixture.Context;
            fixture.Reset();

            var serviceCollection = new ServiceCollection();

            // Configurando os serviços necessários
            serviceCollection.AddTransient<IStaffRepository, StaffRepository>(provider =>
                new StaffRepository(_context));

            serviceCollection.AddTransient<IUnitOfWork, TestUnitOfWork>(provider =>
                new TestUnitOfWork(_context));

            serviceCollection.AddTransient<StaffService>();

            var serviceProvider = serviceCollection.BuildServiceProvider();
            _staffService = serviceProvider.GetService<StaffService>();
        }

        private CreatingStaffDto CreateSampleStaffDto(string email, string firstName = "Test", string lastName = "Staff")
        {
            return new CreatingStaffDto(
                new FullName(firstName, lastName),
                new PhoneNumber("123456789"),
                new Email(email),
                SpecializationUtils.FromString("CARDIOLOGY"),
                new RoleFirstChar { Value = RoleFirstChar.FromRole(Role.Doctor) }
            );
        }

        private Staff ConvertToStaff(CreatingStaffDto staffDto)
        {
            return StaffMapper.ToEntityFromCreating(staffDto); // Usando o StaffMapper

        }

        // Testa se um Staff é adicionado corretamente ao banco de dados.
        [Fact]
        public async Task AddAsync_ShouldCreateStaff_WhenDataIsValid()
        {
            var staffDto = CreateSampleStaffDto("test1@domain.com");
            var staff = ConvertToStaff(staffDto);

            var createdStaff = await _staffService.AddAsync(staff, staffDto.RoleFirstChar);
            await _context.SaveChangesAsync();

            var staffFromDb = await _staffService.GetByEmailAsync(staffDto.Email);

            Assert.NotNull(staffFromDb);
            Assert.Equal(staffDto.FullName, createdStaff.FullName);
            Assert.Equal(staffDto.Specialization, createdStaff.Specialization);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnStaff_WhenStaffExists()
        {
            var staffDto = CreateSampleStaffDto("test2@domain.com");
            var staff = ConvertToStaff(staffDto);

            var createdStaff = await _staffService.AddAsync(staff, staffDto.RoleFirstChar);
            await _context.SaveChangesAsync();

            var staffFromDb = await _staffService.GetByIdAsync(new StaffId(createdStaff.Id));

            Assert.NotNull(staffFromDb);
            Assert.Equal(createdStaff.FullName, staffFromDb.FullName);
        }

        [Fact]
        public async Task InactivateAsync_ShouldInactivateStaff_WhenEmailExists()
        {
            var staffDto = CreateSampleStaffDto("test3@domain.com");
            var staff = ConvertToStaff(staffDto);

            var createdStaff = await _staffService.AddAsync(staff, staffDto.RoleFirstChar);
            await _context.SaveChangesAsync();

            await _staffService.InactivateAsync(staffDto.Email);
            await _context.SaveChangesAsync();

            var staffFromDb = await _staffService.GetByEmailAsync(staffDto.Email);

            Assert.NotNull(staffFromDb);
            Assert.Equal(Status.Inactive, staffFromDb.Status); // Verifica o status
        }

        [Fact]
        public async Task DeleteAsync_ShouldRemoveStaff_WhenStaffIsInactive()
        {
            var staffDto = CreateSampleStaffDto("test4@domain.com");
            var staff = ConvertToStaff(staffDto);

            var createdStaff = await _staffService.AddAsync(staff, staffDto.RoleFirstChar);
            await _context.SaveChangesAsync();

            // Primeiro inativa o staff para que possa ser deletado
            await _staffService.InactivateAsync(staffDto.Email);
            await _context.SaveChangesAsync();

            await _staffService.DeleteAsync(new StaffId(createdStaff.Id));
            await _context.SaveChangesAsync();

            var staffFromDb = await _staffService.GetByIdAsync(new StaffId(createdStaff.Id));

            Assert.Null(staffFromDb); // Verifica que o staff foi deletado
        }
    }
}
