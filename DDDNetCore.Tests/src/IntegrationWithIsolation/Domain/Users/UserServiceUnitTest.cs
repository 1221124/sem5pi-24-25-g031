using Xunit;
using System.Threading.Tasks;
using Domain.Shared;
using Moq;
using Microsoft.Extensions.DependencyInjection;
using Domain.Users;
using System.Linq;
using System;
using System.Collections.Generic;
using DDDNetCore.Tests.src.Infrastructure;

namespace DDDNetCore.Tests.src.IntegrationWithIsolation.Domain.Users
{
    public class UserServiceUnitTest : IClassFixture<TestDatabaseFixture>
    {
        private readonly UserService _userService;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly TestDbContext _context;

        public UserServiceUnitTest(TestDatabaseFixture fixture)
        {
            _context = fixture.Context;
            fixture.Reset();

            var serviceCollection = new ServiceCollection();

            _userRepositoryMock = new Mock<IUserRepository>();

            _userRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<User>()))
                .Callback((User user) => _context.Users.Add(user))
                .ReturnsAsync((User user) => user);

            _userRepositoryMock.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(() => _context.Users.ToList());

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(It.IsAny<UserId>()))
                .ReturnsAsync((UserId userId) => _context.Users.FirstOrDefault(u => u.Id == userId));

            _userRepositoryMock.Setup(repo => repo.GetByEmailAsync(It.IsAny<Email>()))
                .ReturnsAsync((Email email) => _context.Users.FirstOrDefault(u => u.Email.Value == email.Value));

            _userRepositoryMock.Setup(repo => repo.Remove(It.IsAny<User>()))
                .Callback((User user) => _context.Users.Remove(user));

            serviceCollection.AddTransient<IUserRepository>(_ => _userRepositoryMock.Object);

            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _unitOfWorkMock.Setup(uow => uow.CommitAsync())
                .Callback(() => _context.SaveChanges())
                .ReturnsAsync(1);
            serviceCollection.AddTransient<IUnitOfWork>(_ => _unitOfWorkMock.Object);

            serviceCollection.AddTransient<UserService>();

            var serviceProvider = serviceCollection.BuildServiceProvider();
            _userService = serviceProvider.GetService<UserService>();
        }

        [Fact]
        public async Task Create_ShouldCreateUser_WhenAdminRegistersUserWithRoleAsync()
        {
            var creatingUserDto = new CreatingUserDto("test1doctor@isep.ipp.pt", Role.Doctor);

            var user = await _userService.AddAsync(creatingUserDto);
            await _unitOfWorkMock.Object.CommitAsync();

            var users = await _userService.GetAllAsync();
            var addedUser = await _userRepositoryMock.Object.GetByEmailAsync(user.Email);

            Assert.NotNull(user);
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
            await _unitOfWorkMock.Object.CommitAsync();

            await _userService.AddAsync(creatingUserDto);
            await _unitOfWorkMock.Object.CommitAsync();

            var users = await _userService.GetAllAsync();

            Assert.Single(users);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsEmpty_WhenNoUsersExist()
        {
            var users = await _userService.GetAllAsync();

            Assert.Empty(users);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsAllUsers()
        {
            var usersList = new List<User>
            {
                new User("test1doctor@isep.ipp.pt", Role.Doctor),
                new User("test2doctor@isep.ipp.pt", Role.Doctor),
                new User("test3doctor@isep.ipp.pt", Role.Doctor)
            };

            for (int i = 0; i < usersList.Count; i++)
            {
                await _userService.AddAsync(new CreatingUserDto(usersList[i].Email.Value, usersList[i].Role));
                await _unitOfWorkMock.Object.CommitAsync();
            }

            var users = await _userService.GetAllAsync();

            users = users.OrderBy(u => u.Email.Value).ToList();

            Assert.Equal(3, users.Count);

            Assert.Equal(usersList[0].Email, users[0].Email);
            Assert.Equal(usersList[1].Email, users[1].Email);
            Assert.Equal(usersList[2].Email, users[2].Email);

            Assert.Equal(usersList[0].Role, users[0].Role);
            Assert.Equal(usersList[1].Role, users[1].Role);
            Assert.Equal(usersList[2].Role, users[2].Role);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsNull_WhenUserDoesNotExist()
        {
            var nonExistentId = new UserId(Guid.NewGuid());

            var user = await _userService.GetByIdAsync(nonExistentId);

            Assert.Null(user);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsUser_WhenIdExists()
        {
            var creatingUserDto = new CreatingUserDto("test1doctor@isep.ipp.pt", Role.Doctor);
            var user = await _userService.AddAsync(creatingUserDto);
            await _unitOfWorkMock.Object.CommitAsync();

            var userId = user.Id;

            var result = await _userService.GetByIdAsync(new UserId(userId));

            Assert.NotNull(result);
            Assert.Equal(user.Id, result.Id);
            Assert.Equal(user.Email, result.Email);
            Assert.Equal(user.Role, result.Role);
        }

        [Fact]
        public async Task DeleteAsync_DeletesUser_WhenUserExists()
        {
            var creatingUserDto = new CreatingUserDto("test1doctor@isep.ipp.pt", Role.Doctor);
            var user = await _userService.AddAsync(creatingUserDto);
            await _unitOfWorkMock.Object.CommitAsync();

            var userId = user.Id;

            var previousUsers = await _userService.GetAllAsync();

            await _userService.DeleteAsync(new UserId(userId));
            await _unitOfWorkMock.Object.CommitAsync();

            var currentUsers = await _userService.GetAllAsync();

            Assert.Single(previousUsers);
            Assert.Empty(currentUsers);
            Assert.Null(await _userService.GetByIdAsync(new UserId(userId)));
        }

        [Fact]
        public async Task DeleteAsync_DoesNotDelete_WhenUserDoesNotExist()
        {
            var userId = new UserId(Guid.NewGuid());

            var previousUsers = await _userService.GetAllAsync();

            await _userService.DeleteAsync(userId);
            await _unitOfWorkMock.Object.CommitAsync();

            var currentUsers = await _userService.GetAllAsync();

            Assert.Empty(previousUsers);
            Assert.Empty(currentUsers);
            Assert.Null(await _userService.GetByIdAsync(userId));
        }

        [Fact]
        public async Task InactivateAsync_InactivatesUser_WhenUserExists()
        {
            var creatingUserDto = new CreatingUserDto("test1doctor@isep.ipp.pt", Role.Doctor);
            var user = await _userService.AddAsync(creatingUserDto);
            await _unitOfWorkMock.Object.CommitAsync();

            var userId = user.Id;

            var previousUsers = await _userService.GetAllAsync();

            await _userService.InactivateAsync(new UserId(userId));
            await _unitOfWorkMock.Object.CommitAsync();

            var currentUsers = await _userService.GetAllAsync();

            var inactivatedUser = await _userService.GetByIdAsync(new UserId(userId));

            Assert.NotNull(inactivatedUser);
            Assert.Equal(UserStatus.Inactive, inactivatedUser.UserStatus);

            Assert.Single(previousUsers);
            Assert.Single(currentUsers);
        }

        [Fact]
        public async Task InactivateAsync_DoesNotInactivate_WhenUserDoesNotExist()
        {
            var userId = new UserId(Guid.NewGuid());

            var previousUsers = await _userService.GetAllAsync();

            await _userService.InactivateAsync(userId);
            await _unitOfWorkMock.Object.CommitAsync();

            var currentUsers = await _userService.GetAllAsync();

            var inactivatedUser = await _userService.GetByIdAsync(userId);

            Assert.Null(inactivatedUser);
            Assert.Empty(previousUsers);
            Assert.Empty(currentUsers);
        }

        [Fact]
        public async Task GetByEmailAsync_ReturnsNull_WhenUserDoesNotExist()
        {
            var nonExistentEmail = new Email("email@email.com");

            var user = await _userService.GetByEmailAsync(nonExistentEmail);

            Assert.Null(user);
        }

        [Fact]
        public async Task GetByEmailAsync_ReturnsUser_WhenEmailExists()
        {
            var creatingUserDto = new CreatingUserDto("test1doctor@isep.ipp.pt", Role.Doctor);
            var user = await _userService.AddAsync(creatingUserDto);
            await _unitOfWorkMock.Object.CommitAsync();

            var email = user.Email;

            var result = await _userService.GetByEmailAsync(email);

            Assert.NotNull(result);
            Assert.Equal(user.Id, result.Id);
            Assert.Equal(user.Email, result.Email);
            Assert.Equal(user.Role, result.Role);
        }
    }
}