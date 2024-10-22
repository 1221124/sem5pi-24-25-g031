// using Xunit;
// using Moq;
// using Domain.Users;
// using System.Threading.Tasks;
// using Domain.Shared;
// using Infrastructure;
// using Microsoft.EntityFrameworkCore;

// namespace Users
// {
//     public class UserServiceTest
//     {
//         private readonly UserService _userService;
//         private readonly Mock<IUserRepository> _userRepositoryMock;
//         private readonly DbContextOptions<SARMDbContext> _options;

//         public UserServiceTest()
//         {
//             _options = new DbContextOptionsBuilder<SARMDbContext>()
//                 .UseInMemoryDatabase("TestDatabase")
//                 .Options;
//             _userRepositoryMock = new Mock<IUserRepository>();
//             _userService = new UserService(new UnitOfWork(new SARMDbContext(_options)), _userRepositoryMock.Object);
//         }

//         [Fact]
//         public async Task Create_ShouldCreateUser_WhenAdminRegistersUserWithRoleAsync()
//         {
//             var creatingUserDto = new CreatingUserDto("test1doctor" + AppSettings.EmailDomain, "Doctor");

//             var user = await _userService.AddAsync(creatingUserDto);

//             _userRepositoryMock.Verify(repo => repo.AddAsync(It.Is<User>(u => u.Email == new Email("test1doctor" + AppSettings.EmailDomain) && u.Role == Role.Doctor)), Times.Once);
//         }

//         [Fact]
//         public async Task Create_ShouldThrowException_WhenEmailDomainIsInvalid()
//         {
//             var creatingUserDto = new CreatingUserDto("test2doctor@invaliddomain.com", "Doctor");

//             await Assert.ThrowsAsync<System.Exception>(() => _userService.AddAsync(creatingUserDto));
//         }

//         [Fact]
//         public async Task Create_ShouldThrowException_WhenRoleIsInvalid()
//         {
//             var creatingUserDto = new CreatingUserDto("test3doctor" + AppSettings.EmailDomain, "InvalidRole");

//             await Assert.ThrowsAsync<System.Exception>(() => _userService.AddAsync(creatingUserDto));
//         }
//     }
// }