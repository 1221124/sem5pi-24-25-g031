// using System.Collections.Generic;
// using System.Net;
// using System.Net.Http;
// using System.Text;
// using System.Threading.Tasks;
// using Microsoft.AspNetCore.Mvc.Testing;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.Extensions.DependencyInjection;
// using Microsoft.VisualStudio.TestTools.UnitTesting;
// using Newtonsoft.Json;
// using Domain.Users;
// using Xunit;
// using Microsoft.VisualStudio.TestPlatform.TestHost;
// using System.Linq;
// using Infrastructure;
// using Assert = Microsoft.VisualStudio.TestTools.UnitTesting.Assert;
// using Domain.Shared;

// namespace Users
// {
//     [TestClass]
//     public class UsersControllerAcceptanceTest : IClassFixture<WebApplicationFactory<Program>>
//     {
//         private readonly WebApplicationFactory<Program> _factory;
//         private readonly HttpClient _client;

//         public UsersControllerAcceptanceTest()
//         {
//             _factory = new WebApplicationFactory<Program>()
//                 .WithWebHostBuilder(builder =>
//                 {
//                     builder.ConfigureServices(services =>
//                     {
//                         var descriptor = services.SingleOrDefault(
//                             d => d.ServiceType == typeof(DbContextOptions<SARMDbContext>));
//                         if (descriptor != null)
//                         {
//                             services.Remove(descriptor);
//                         }

//                         services.AddDbContext<SARMDbContext>(options =>
//                         {
//                             options.UseInMemoryDatabase("TestDb");
//                         });
//                     });
//                 });

//             _client = _factory.CreateClient();
//         }

//         [TestMethod]
//         public async Task GetAll_ReturnsListOfUsers()
//         {
//             await CreateTestUserAsync("testuser1@domain.com");
//             await CreateTestUserAsync("testuser2@domain.com");

//             var response = await _client.GetAsync("/api/Users");

//             Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
//             var users = JsonConvert.DeserializeObject<List<UserDto>>(await response.Content.ReadAsStringAsync());
//             Assert.IsTrue(users.Count >= 2);
//         }

//         [TestMethod]
//         public async Task CreateBackofficeUser_ReturnsCreatedUser()
//         {
//             var userDto = new CreatingUserDto(new Email("doctor1@myhospital.com"), Role.Doctor);
//             var content = new StringContent(JsonConvert.SerializeObject(userDto), Encoding.UTF8, "application/json");

//             var response = await _client.PostAsync("/api/Users/backoffice/create", content);

//             Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);
//             var createdUser = JsonConvert.DeserializeObject<UserDto>(await response.Content.ReadAsStringAsync());
//             Assert.AreEqual("doctor1@myhospital.com", createdUser.Email.Value);
//         }

//         [TestMethod]
//         public async Task GetById_ReturnsUser()
//         {
//             var createdUser = await CreateTestUserAsync("testuser@domain.com");

//             var response = await _client.GetAsync($"/api/Users/{createdUser.Id}");

//             Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
//             var user = JsonConvert.DeserializeObject<UserDto>(await response.Content.ReadAsStringAsync());
//             Assert.AreEqual("testuser@domain.com", user.Email.Value);
//         }

//         [TestMethod]
//         public async Task UpdateUser_ReturnsUpdatedUser()
//         {
//             var createdUser = await CreateTestUserAsync("testuser@domain.com");
//             createdUser.Role = Role.Nurse;

//             var content = new StringContent(JsonConvert.SerializeObject(createdUser), Encoding.UTF8, "application/json");

//             var response = await _client.PutAsync($"/api/Users/{createdUser.Id}", content);

//             Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
//             var updatedUser = JsonConvert.DeserializeObject<UserDto>(await response.Content.ReadAsStringAsync());
//             Assert.AreEqual(Role.Nurse, updatedUser.Role);
//         }

//         [TestMethod]
//         public async Task SoftDeleteUser_ReturnsOk()
//         {
//             var createdUser = await CreateTestUserAsync("testuser@domain.com");

//             var response = await _client.DeleteAsync($"/api/Users/{createdUser.Id}");

//             Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
//             var deletedUser = JsonConvert.DeserializeObject<UserDto>(await response.Content.ReadAsStringAsync());
//         }

//         [TestMethod]
//         public async Task HardDeleteUser_ReturnsNotFoundOnSubsequentGet()
//         {
//             var createdUser = await CreateTestUserAsync("testuser@domain.com");

//             var deleteResponse = await _client.DeleteAsync($"/api/Users/{createdUser.Id}/hard");
//             var getResponse = await _client.GetAsync($"/api/Users/{createdUser.Id}");

//             Assert.AreEqual(HttpStatusCode.OK, deleteResponse.StatusCode);
//             Assert.AreEqual(HttpStatusCode.NotFound, getResponse.StatusCode);
//         }

//         private async Task<UserDto> CreateTestUserAsync(string email)
//         {
//             var userDto = new CreatingUserDto(new Email(email), Role.Patient);

//             var response = await _client.PostAsync("/api/Users", new StringContent(JsonConvert.SerializeObject(userDto), Encoding.UTF8, "application/json"));

//             return JsonConvert.DeserializeObject<UserDto>(await response.Content.ReadAsStringAsync());
//         }
//     }
// }
