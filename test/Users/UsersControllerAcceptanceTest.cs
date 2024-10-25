// using System;
// using System.Collections.Generic;
// using System.Net;
// using System.Net.Http;
// using System.Text;
// using System.Threading.Tasks;
// using Microsoft.AspNetCore.Mvc.Testing;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.Extensions.DependencyInjection;
// using Microsoft.Extensions.DependencyInjection.Extensions;
// using Microsoft.VisualStudio.TestTools.UnitTesting;
// using Newtonsoft.Json;
// using Domain.Users;
// using Domain.Emails;

// namespace Users
// {
//     [TestClass]
//     public class UsersControllerAcceptanceTest : IClassFixture<WebApplicationFactory<Startup>>
//     {
//         private readonly WebApplicationFactory<Startup> _factory;
//         private readonly HttpClient _client;

//         public UsersControllerAcceptanceTest()
//         {
//             _factory = new WebApplicationFactory<Startup>()
//                 .WithWebHostBuilder(builder =>
//                 {
//                     builder.ConfigureServices(services =>
//                     {
//                         // Remover o contexto do banco de dados real
//                         var descriptor = services.SingleOrDefault(
//                             d => d.ServiceType == typeof(DbContextOptions<SARMDbContext>));
//                         if (descriptor != null)
//                         {
//                             services.Remove(descriptor);
//                         }

//                         // Adicionar contexto de banco de dados em memória
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
//             // Arrange
//             await CreateTestUserAsync("testuser1@domain.com");
//             await CreateTestUserAsync("testuser2@domain.com");

//             // Act
//             var response = await _client.GetAsync("/api/Users");

//             // Assert
//             Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
//             var users = JsonConvert.DeserializeObject<List<UserDto>>(await response.Content.ReadAsStringAsync());
//             Assert.IsTrue(users.Count >= 2);
//         }

//         [TestMethod]
//         public async Task CreateBackofficeUser_ReturnsCreatedUser()
//         {
//             // Arrange
//             var userDto = new CreatingUserDto
//             {
//                 Email = new Email("doctor1@myhospital.com"),
//                 Role = Role.Doctor
//             };
//             var content = new StringContent(JsonConvert.SerializeObject(userDto), Encoding.UTF8, "application/json");

//             // Act
//             var response = await _client.PostAsync("/api/Users/backoffice/create", content);

//             // Assert
//             Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);
//             var createdUser = JsonConvert.DeserializeObject<UserDto>(await response.Content.ReadAsStringAsync());
//             Assert.AreEqual("doctor1@myhospital.com", createdUser.Email.Value);
//         }

//         [TestMethod]
//         public async Task GetById_ReturnsUser()
//         {
//             // Arrange
//             var createdUser = await CreateTestUserAsync("testuser@domain.com");

//             // Act
//             var response = await _client.GetAsync($"/api/Users/{createdUser.Id}");

//             // Assert
//             Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
//             var user = JsonConvert.DeserializeObject<UserDto>(await response.Content.ReadAsStringAsync());
//             Assert.AreEqual("testuser@domain.com", user.Email.Value);
//         }

//         [TestMethod]
//         public async Task UpdateUser_ReturnsUpdatedUser()
//         {
//             // Arrange
//             var createdUser = await CreateTestUserAsync("testuser@domain.com");
//             createdUser.Role = Role.Nurse;

//             var content = new StringContent(JsonConvert.SerializeObject(createdUser), Encoding.UTF8, "application/json");

//             // Act
//             var response = await _client.PutAsync($"/api/Users/{createdUser.Id}", content);

//             // Assert
//             Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
//             var updatedUser = JsonConvert.DeserializeObject<UserDto>(await response.Content.ReadAsStringAsync());
//             Assert.AreEqual(Role.Nurse, updatedUser.Role);
//         }

//         [TestMethod]
//         public async Task SoftDeleteUser_ReturnsOk()
//         {
//             // Arrange
//             var createdUser = await CreateTestUserAsync("testuser@domain.com");

//             // Act
//             var response = await _client.DeleteAsync($"/api/Users/{createdUser.Id}");

//             // Assert
//             Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
//             var deletedUser = JsonConvert.DeserializeObject<UserDto>(await response.Content.ReadAsStringAsync());
//             Assert.IsNotNull(deletedUser.InactiveDate);
//         }

//         [TestMethod]
//         public async Task HardDeleteUser_ReturnsNotFoundOnSubsequentGet()
//         {
//             // Arrange
//             var createdUser = await CreateTestUserAsync("testuser@domain.com");

//             // Act
//             var deleteResponse = await _client.DeleteAsync($"/api/Users/{createdUser.Id}/hard");
//             var getResponse = await _client.GetAsync($"/api/Users/{createdUser.Id}");

//             // Assert
//             Assert.AreEqual(HttpStatusCode.OK, deleteResponse.StatusCode);
//             Assert.AreEqual(HttpStatusCode.NotFound, getResponse.StatusCode);
//         }

//         private async Task<UserDto> CreateTestUserAsync(string email)
//         {
//             var userDto = new CreatingUserDto
//             {
//                 Email = new Email(email),
//                 Role = Role.Patient
//             };

//             var content = new StringContent(JsonConvert.SerializeObject(userDto), Encoding.UTF8, "application/json");
//             var response = await _client.PostAsync("/api/Users/patient", content);
//             response.EnsureSuccessStatusCode();

//             return JsonConvert.DeserializeObject<UserDto>(await response.Content.ReadAsStringAsync());
//         }
//     }
// }
