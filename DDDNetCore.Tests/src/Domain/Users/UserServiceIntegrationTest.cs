// using Xunit;
// using Moq;
// using Domain.Users;
// using System.Threading.Tasks;
// using Domain.Shared;
// using Infrastructure;
// using Microsoft.EntityFrameworkCore;
//
// namespace Domain.Users
// {
//     public class UserServiceIntegrationTest
//     {
//         private readonly UserService _userService;
//         private readonly DbContextOptions<SARMDbContext> _options;
//
//         public UserServiceIntegrationTest()
//         {
//             _options = new DbContextOptionsBuilder<SARMDbContext>()
//                 .UseInMemoryDatabase(databaseName: "UserServiceIntegrationTestDatabase")
//                 .Options;
//
//             var context = new SARMDbContext(_options);
//             context.Users.AddRange(
//                 new User { Email = new Email("test1" + AppSettings.EmailDomain) },
//                 new User { Email = new Email("test2" + AppSettings.EmailDomain) }
//             );
//             context.SaveChanges();
//
//             var userRepository = new UserRepository(context);
//             _userService = new UserService(new UnitOfWork(context), userRepository);
//         }
//
//         [Fact]
//         public async Task GetByIdAsync_ReturnsUser_WhenIdExists()
//         {
//             var userToFind = await _userService.GetAllAsync();
//             var userId = new UserId(userToFind[0].Id); 
//
//             var user = await _userService.GetByIdAsync(userId);
//
//             Assert.NotNull(user);
//             Assert.Equal(userToFind[0].Email.Value, user.Email.Value);
//             Assert.Equal(userToFind[0].Role, user.Role);
//         }
//
//         [Fact]
//         public async Task AddUser_AddsUserToDatabase()
//         {
//             var newUser = new CreatingUserDto (
//                 "test3" + AppSettings.EmailDomain,
//                 "Doctor"
//             );
//
//             await _userService.AddAsync(newUser);
//
//             var users = await _userService.GetAllAsync();
//             var user = users.Find(u => u.Email.Value == "test3" + AppSettings.EmailDomain);
//             
//             Assert.NotNull(user);
//             Assert.Equal("test3" + AppSettings.EmailDomain, user.Email.Value);
//         }
//
//         [Fact]
//         public async Task GetAllAsync_ReturnsAllUsers()
//         {
//             var users = await _userService.GetAllAsync();
//
//             Assert.NotNull(users);
//             Assert.Equal(2, users.Count);
//             Assert.Equal("test1" + AppSettings.EmailDomain, users[0].Email.Value);
//             Assert.Equal("test2" + AppSettings.EmailDomain, users[1].Email.Value);
//         }
//
//         [Fact]
//         public async Task InactivateAsync_InactivatesUserInDatabase()
//         {
//             var userToInactivate = await _userService.GetAllAsync();
//             var userId = new UserId(userToInactivate[0].Id); 
//             await _userService.InactivateAsync(userId);
//
//             var user = await _userService.GetByIdAsync(userId);
//
//             Assert.NotNull(user);
//             Assert.True(user.UserStatus == UserStatus.Inactive);
//         }
//
//         [Fact]
//         public async Task DeleteAsync_DeletesUserFromDatabase()
//         {
//             var userToDelete = await _userService.GetAllAsync();
//             var userId = new UserId(userToDelete[0].Id); 
//             await _userService.DeleteAsync(userId); 
//
//             var user = await _userService.GetByIdAsync(userId);
//
//             Assert.Null(user); 
//         }
//     }
// }