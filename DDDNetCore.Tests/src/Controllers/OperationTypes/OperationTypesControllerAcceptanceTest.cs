// using System;
// using System.Net.Http;
// using System.Text;
// using System.Threading.Tasks;
// using Microsoft.AspNetCore.Mvc.Testing;
// using Microsoft.Extensions.DependencyInjection;
// using Microsoft.Extensions.DependencyInjection.Extensions;
// using Microsoft.Extensions.Hosting;
// using Microsoft.VisualStudio.TestTools.UnitTesting;
// using Newtonsoft.Json;
// using Domain.OperationTypes;
// using Xunit;
// using Microsoft.VisualStudio.TestPlatform.TestHost;
// using System.Linq;

// namespace OperationTypes
// {
//     [TestClass]
//     public class OperationTypesControllerAcceptanceTest : IClassFixture<WebApplicationFactory<Program>>
//     {
//         private readonly WebApplicationFactory<Program> _factory;
//         private readonly HttpClient _client;

//         public OperationTypesControllerAcceptanceTest()
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

//                         // Adicionar o contexto de banco de dados em memória para testes
//                         services.AddDbContext<SARMDbContext>(options =>
//                         {
//                             options.UseInMemoryDatabase("TestDb");
//                         });
//                     });
//                 });

//             _client = _factory.CreateClient();
//         }

//         [TestMethod]
//         public async Task CreateOperationType_ReturnsCreatedResponse()
//         {
//             // Arrange
//             var newOperationType = new CreatingOperationTypeDto
//             {
//                 Name = "TestOperation",
//                 Specialization = Specialization.General,
//                 Status = Status.Active,
//                 RequiredStaff = new List<RequiredStaff>(),
//                 PhasesDuration = new List<int> { 10, 20, 30 }
//             };
//             var content = new StringContent(JsonConvert.SerializeObject(newOperationType), Encoding.UTF8, "application/json");

//             // Act
//             var response = await _client.PostAsync("/api/OperationTypes", content);

//             // Assert
//             Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);
//         }

//         [TestMethod]
//         public async Task GetOperationTypeById_ReturnsOperationType()
//         {
//             // Arrange
//             var newOperationType = new CreatingOperationTypeDto
//             {
//                 Name = "TestOperation",
//                 Specialization = Specialization.General,
//                 Status = Status.Active,
//                 RequiredStaff = new List<RequiredStaff>(),
//                 PhasesDuration = new List<int> { 10, 20, 30 }
//             };
//             var content = new StringContent(JsonConvert.SerializeObject(newOperationType), Encoding.UTF8, "application/json");
//             var postResponse = await _client.PostAsync("/api/OperationTypes", content);
//             var operationType = JsonConvert.DeserializeObject<OperationTypeDto>(await postResponse.Content.ReadAsStringAsync());

//             // Act
//             var getResponse = await _client.GetAsync($"/api/OperationTypes/id/{operationType.Id}");

//             // Assert
//             Assert.AreEqual(HttpStatusCode.OK, getResponse.StatusCode);
//             var returnedOperationType = JsonConvert.DeserializeObject<OperationTypeDto>(await getResponse.Content.ReadAsStringAsync());
//             Assert.AreEqual(newOperationType.Name, returnedOperationType.Name);
//         }

//         [TestMethod]
//         public async Task UpdateOperationType_ReturnsUpdatedOperationType()
//         {
//             // Arrange
//             var newOperationType = new CreatingOperationTypeDto
//             {
//                 Name = "UpdateTest",
//                 Specialization = Specialization.General,
//                 Status = Status.Active,
//                 RequiredStaff = new List<RequiredStaff>(),
//                 PhasesDuration = new List<int> { 15, 25, 35 }
//             };
//             var content = new StringContent(JsonConvert.SerializeObject(newOperationType), Encoding.UTF8, "application/json");
//             var postResponse = await _client.PostAsync("/api/OperationTypes", content);
//             var operationType = JsonConvert.DeserializeObject<OperationTypeDto>(await postResponse.Content.ReadAsStringAsync());

//             operationType.Name = "UpdatedOperationType";
//             content = new StringContent(JsonConvert.SerializeObject(operationType), Encoding.UTF8, "application/json");

//             // Act
//             var updateResponse = await _client.PutAsync($"/api/OperationTypes/{operationType.Id}", content);

//             // Assert
//             Assert.AreEqual(HttpStatusCode.OK, updateResponse.StatusCode);
//             var updatedOperationType = JsonConvert.DeserializeObject<OperationTypeDto>(await updateResponse.Content.ReadAsStringAsync());
//             Assert.AreEqual("UpdatedOperationType", updatedOperationType.Name);
//         }

//         [TestMethod]
//         public async Task DeleteOperationType_ReturnsNotFoundAfterDeletion()
//         {
//             // Arrange
//             var newOperationType = new CreatingOperationTypeDto
//             {
//                 Name = "DeleteTest",
//                 Specialization = Specialization.General,
//                 Status = Status.Active,
//                 RequiredStaff = new List<RequiredStaff>(),
//                 PhasesDuration = new List<int> { 5, 15, 25 }
//             };
//             var content = new StringContent(JsonConvert.SerializeObject(newOperationType), Encoding.UTF8, "application/json");
//             var postResponse = await _client.PostAsync("/api/OperationTypes", content);
//             var operationType = JsonConvert.DeserializeObject<OperationTypeDto>(await postResponse.Content.ReadAsStringAsync());

//             // Act
//             var deleteResponse = await _client.DeleteAsync($"/api/OperationTypes/{operationType.Id}/hard");
//             var getResponse = await _client.GetAsync($"/api/OperationTypes/id/{operationType.Id}");

//             // Assert
//             Assert.AreEqual(HttpStatusCode.OK, deleteResponse.StatusCode);
//             Assert.AreEqual(HttpStatusCode.NotFound, getResponse.StatusCode);
//         }
//     }
// }
