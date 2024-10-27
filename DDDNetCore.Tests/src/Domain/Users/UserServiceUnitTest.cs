using Xunit;
using System.Threading.Tasks;
using Domain.Shared;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using Moq;
using Microsoft.Extensions.DependencyInjection;
using Domain.Users;
using DDDNetCore.Tests.Infrastructure;
using System.Linq;
using System;

namespace DDDNetCore.Tests.Domain.Users
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

            _userRepositoryMock.Setup(repo => repo.GetByEmailAsync(It.IsAny<Email>()))
                .ReturnsAsync((Email email) => _context.Users.FirstOrDefault(u => u.Email.Value == email.Value));

            _userRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<User>()))
                .Callback((User user) => _context.Users.Add(user))
                .ReturnsAsync((User user) => user);

            _userRepositoryMock.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(() => _context.Users.ToList());

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
    }
}