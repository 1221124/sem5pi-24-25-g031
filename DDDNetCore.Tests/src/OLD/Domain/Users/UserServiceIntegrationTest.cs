using Xunit;
using System.Threading.Tasks;
using Domain.Shared;
using Microsoft.Extensions.DependencyInjection;
using Domain.Users;
using Infrastructure.Users;
using DDDNetCore.Tests.Infrastructure;

namespace DDDNetCore.Tests.Domain.Users
{
    public class UserServiceIntegrationTest : IClassFixture<TestDatabaseFixture>
    {
         private readonly UserService _userService;
        private readonly TestDbContext _context;

        public UserServiceIntegrationTest(TestDatabaseFixture fixture)
        {
            _context = fixture.Context;
            fixture.Reset();

            var serviceCollection = new ServiceCollection();

            serviceCollection.AddTransient<IUserRepository, UserRepository>(provider =>
                new UserRepository(_context));

            serviceCollection.AddTransient<IUnitOfWork, TestUnitOfWork>(provider =>
                new TestUnitOfWork(_context));

            serviceCollection.AddTransient<UserService>();

            var serviceProvider = serviceCollection.BuildServiceProvider();
            _userService = serviceProvider.GetService<UserService>();
        }

        [Fact]
        public async Task Create_ShouldCreateUser_WhenAdminRegistersUserWithRoleAsync()
        {
            var creatingUserDto = new CreatingUserDto("test1doctor@isep.ipp.pt", Role.Doctor);

            var user = await _userService.AddAsync(creatingUserDto);
            await _context.SaveChangesAsync();

            var users = await _userService.GetAllAsync();
            var addedUser = await _userService.GetByEmailAsync(new Email("test1doctor@isep.ipp.pt"));

            Assert.NotNull(addedUser);
            Assert.Equal(new Email("test1doctor@isep.ipp.pt"), user.Email);
            Assert.Equal(Role.Doctor, user.Role);

            Assert.Single(users);
            Assert.Equal(addedUser.Email, user.Email);
            Assert.Equal(addedUser.Role, user.Role);
        }

        [Fact]
        public async Task Create_NotRegistered_WhenUserAlreadyExistsAsync()
        {
            var creatingUserDto = new CreatingUserDto("test1doctor@isep.ipp.pt", Role.Doctor);

            await _userService.AddAsync(creatingUserDto);
            await _context.SaveChangesAsync();

            await _userService.AddAsync(creatingUserDto);
            await _context.SaveChangesAsync();

            var users = await _userService.GetAllAsync();

            Assert.Single(users);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsUser_WhenIdExists()
        {
            var creatingUserDto = new CreatingUserDto("test2doctor@isep.ipp.pt", Role.Doctor);
            var createdUser = await _userService.AddAsync(creatingUserDto);
            await _context.SaveChangesAsync();

            var userId = createdUser.Id;
            var user = await _userService.GetByIdAsync(new UserId(userId));

            Assert.NotNull(user);
            Assert.Equal(createdUser.Email, user.Email);
            Assert.Equal(createdUser.Role, user.Role);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsAllUsers()
        {
            var creatingUserDto1 = new CreatingUserDto("test3doctor@isep.ipp.pt", Role.Doctor);
            var creatingUserDto2 = new CreatingUserDto("test4doctor@isep.ipp.pt", Role.Doctor);

            await _userService.AddAsync(creatingUserDto1);
            await _context.SaveChangesAsync();
            await _userService.AddAsync(creatingUserDto2);
            await _context.SaveChangesAsync();

            var users = await _userService.GetAllAsync();

            Assert.NotNull(users);
            Assert.Equal(2, users.Count);
            Assert.Contains(users, u => u.Email.Value == "test3doctor@isep.ipp.pt");
            Assert.Contains(users, u => u.Email.Value == "test4doctor@isep.ipp.pt");
        }

        [Fact]
        public async Task InactivateAsync_InactivatesUserInDatabase()
        {
            var creatingUserDto = new CreatingUserDto("test5doctor@isep.ipp.pt", Role.Doctor);
            var createdUser = await _userService.AddAsync(creatingUserDto);
            await _context.SaveChangesAsync();

            var userId = createdUser.Id;
            await _userService.InactivateAsync(new UserId(userId));
            await _context.SaveChangesAsync();

            var user = await _userService.GetByIdAsync(new UserId(userId));

            Assert.NotNull(user);
            Assert.True(user.UserStatus == UserStatus.Inactive);
        }

        [Fact]
        public async Task DeleteAsync_DeletesUserFromDatabase()
        {
            var creatingUserDto = new CreatingUserDto("test6doctor@isep.ipp.pt", Role.Doctor);
            var createdUser = await _userService.AddAsync(creatingUserDto);
            await _context.SaveChangesAsync();

            var userId = createdUser.Id;
            await _userService.DeleteAsync(new UserId(userId));
            await _context.SaveChangesAsync();

            var user = await _userService.GetByIdAsync(new UserId(userId));

            Assert.Null(user);
        }
    }
}