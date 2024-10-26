// using System;
// using System.Collections.Generic;
// using System.Net;
// using System.Net.Http;
// using System.Text;
// using System.Threading.Tasks;
// using Domain.OperationRequests;
// using Domain.DBLogs;
// using Infrastructure;
// using Microsoft.AspNetCore.Mvc.Testing;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.Extensions.DependencyInjection;
// using Microsoft.VisualStudio.TestTools.UnitTesting;
// using Newtonsoft.Json;
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
// using Domain.Patients;
// using Domain.Staffs;
//
// namespace OperationRequests
// {
//     [TestClass]
//     public class OperationRequestControllerAcceptanceTest : IClassFixture<WebApplicationFactory<Startup>>
//     {
//         private readonly WebApplicationFactory<Startup> _factory;
//         private readonly HttpClient _client;
//         private OperationRequestId _operationRequestId = Guid.NewGuid();
//         private StaffId _staffId = Guid.NewGuid();
//         private PatientId _patientId = Guid.NewGuid();
//         private OperationTypeId _operationTypeId = Guid.NewGuid();
//
//         public OperationRequestControllerAcceptanceTest()
//         {
//             _factory = new WebApplicationFactory<Startup>()
//                 .WithWebHostBuilder(builder =>
//                 {
//                     builder.ConfigureServices(services =>
//                     {
//                         var descriptor = services.SingleOrDefault(
//                             d => d.ServiceType == typeof(DbContextOptions<SARMDbContext>));
//
//                         if (descriptor != null)
//                         {
//                             services.Remove(descriptor);
//                         }
//                         
//                         services.AddDbContext<SARMDbContext>(options =>
//                         {
//                             options.UseInMemoryDatabase("TestDb");
//                         });
//                     });
//                 });
//
//             _client = _factory.CreateClient();
//         }
//
//         [TestMethod]
//         public async Task CreateOperationRequest_ReturnsCreatedResponse()
//         {
//             // Arrange
//             var newOperationRequest = new CreatingOperationRequestDto
//             {
//                 StaffId = _staffId,
//                 PatientId = _patientId,
//                 OperationTypeId = _operationTypeId,
//                 DeadlineDate = new DeadlineDate(DateTime.MaxValue),
//                 Priority = Priority.URGENT
//             };
//             var content = new StringContent(JsonConvert.SerializeObject(newOperationRequest), Encoding.UTF8, "application/json");
//
//             // Act
//             var response = await _client.PostAsync("/api/operationrequest", content);
//
//             // Assert
//             Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
//         }
//
//         [TestMethod]
//         public async Task GetAllOperationRequests_ReturnsOkResponse()
//         {
//             // Act
//             var response = await _client.GetAsync("/api/operationrequest");
//
//             // Assert
//             Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
//         }
//
//         [TestMethod]
//         public async Task GetOperationRequestById_ReturnsOperationRequest()
//         {
//             // Arrange
//             var newOperationRequest = new OperationRequestDto
//             {
//                 DoctorId = _staffId,
//                 PatientId = _patientId,
//                 OperationTypeId = _operationTypeId,
//                 DeadlineDate = new DeadlineDate(DateTime.MaxValue),
//                 Priority = Priority.URGENT,
//                 Status = RequestStatus.PENDING
//             };
//             
//             var content = new StringContent(JsonConvert.SerializeObject(newOperationRequest), Encoding.UTF8, "application/json");
//             var postResponse = await _client.PostAsync("/api/operationrequest", content);
//             var operationRequest = JsonConvert.DeserializeObject<OperationRequest>(await postResponse.Content.ReadAsStringAsync());
//
//             // Act
//             var getResponse = await _client.GetAsync($"/api/operationrequest/{operationRequest.Id}");
//
//             // Assert
//             Assert.AreEqual(HttpStatusCode.OK, getResponse.StatusCode);
//             var returnedOperationRequest = JsonConvert.DeserializeObject<OperationRequest>(await getResponse.Content.ReadAsStringAsync());
//             Assert.AreEqual(operationRequest.Id, returnedOperationRequest.Id);
//         }
//
//         [TestMethod]
//         public async Task GetOperationRequestByPatientName_ReturnsOkResponse()
//         {
//             // Arrange
//             var newOperationRequest = new OperationRequestDto
//             {
//                 DoctorId = _staffId,
//                 PatientId = _patientId,
//                 OperationTypeId = _operationTypeId,
//                 DeadlineDate = new DeadlineDate(DateTime.MaxValue),
//                 Priority = Priority.URGENT,
//                 Status = RequestStatus.PENDING
//             };
//             var content = new StringContent(JsonConvert.SerializeObject(newOperationRequest), Encoding.UTF8, "application/json");
//             await _client.PostAsync("/api/operationrequest", content);
//
//             // Act
//             var getResponse = await _client.PostAsync("/api/operationrequest/patientname/JohnDoe", null);
//
//             // Assert
//             Assert.AreEqual(HttpStatusCode.OK, getResponse.StatusCode);
//         }
//
//         [TestMethod]
//         public async Task GetOperationRequestByOperationType_ReturnsOkResponse()
//         {
//             // Arrange
//             var newOperationRequest = new OperationRequestDto
//             {
//                 DoctorId = _staffId,
//                 PatientId = _patientId,
//                 OperationTypeId = _operationTypeId,
//                 DeadlineDate = new DeadlineDate(DateTime.MaxValue),
//                 Priority = Priority.URGENT,
//                 Status = RequestStatus.PENDING
//             };
//             var content = new StringContent(JsonConvert.SerializeObject(newOperationRequest), Encoding.UTF8, "application/json");
//             await _client.PostAsync("/api/operationrequest", content);
//
//             // Act
//             var getResponse = await _client.PostAsync("/api/operationrequest/operationtype/123", null);
//
//             // Assert
//             Assert.AreEqual(HttpStatusCode.OK, getResponse.StatusCode);
//         }
//
//         [TestMethod]
//         public async Task GetOperationRequestByStatus_ReturnsOkResponse()
//         {
//             // Arrange
//             var newOperationRequest = new OperationRequestDto
//             {
//                 DoctorId = _staffId,
//                 PatientId = _patientId,
//                 OperationTypeId = _operationTypeId,
//                 DeadlineDate = new DeadlineDate(DateTime.MaxValue),
//                 Priority = Priority.URGENT,
//                 Status = RequestStatus.PENDING
//             };
//             var content = new StringContent(JsonConvert.SerializeObject(newOperationRequest), Encoding.UTF8, "application/json");
//             await _client.PostAsync("/api/operationrequest", content);
//
//             // Act
//             var getResponse = await _client.PostAsync("/api/operationrequest/status/1", null);
//
//             // Assert
//             Assert.AreEqual(HttpStatusCode.OK, getResponse.StatusCode);
//         }
//
//         [TestMethod]
//         public async Task UpdateOperationRequest_ReturnsOkResponse()
//         {
//             // Arrange
//             var newOperationRequest = new OperationRequestDto
//             {
//                 Id = _operationRequestId,
//                 DoctorId = _staffId,
//                 PatientId = _patientId,
//                 OperationTypeId = _operationTypeId,
//                 DeadlineDate = new DeadlineDate(DateTime.MaxValue),
//                 Priority = Priority.URGENT,
//                 Status = RequestStatus.PENDING
//             };
//             var content = new StringContent(JsonConvert.SerializeObject(newOperationRequest), Encoding.UTF8, "application/json");
//             var postResponse = await _client.PostAsync("/api/operationrequest", content);
//             var operationRequest = JsonConvert.DeserializeObject<OperationRequest>(await postResponse.Content.ReadAsStringAsync());
//
//             var updatingOperationRequest = new UpdatingOperationRequestDto
//             {
//                 Id = _operationRequestId,
//                 DeadlineDate = new DeadlineDate(DateTime.MaxValue),
//                 Priority = Priority.URGENT,
//                 RequestStatus = RequestStatus.PENDING
//             };
//             content = new StringContent(JsonConvert.SerializeObject(updatingOperationRequest), Encoding.UTF8, "application/json");
//
//             // Act
//             var updateResponse = await _client.PostAsync("/api/operationrequest/update", content);
//
//             // Assert
//             Assert.AreEqual(HttpStatusCode.OK, updateResponse.StatusCode);
//         }
//
//         [TestMethod]
//         public async Task DeleteOperationRequest_ReturnsOkResponse()
//         {
//             // Arrange
//             var newOperationRequest = new OperationRequestDto
//             {
//                 Id = _operationTypeId.AsGuid()
//             };
//             var content = new StringContent(JsonConvert.SerializeObject(newOperationRequest), Encoding.UTF8, "application/json");
//             var postResponse = await _client.PostAsync("/api/operationrequest", content);
//             var operationRequest = JsonConvert.DeserializeObject<OperationRequest>(await postResponse.Content.ReadAsStringAsync());
//
//             // Act
//             var deleteResponse = await _client.DeleteAsync($"/api/operationrequest/delete/{operationRequest.Id}");
//
//             // Assert
//             Assert.AreEqual(HttpStatusCode.OK, deleteResponse.StatusCode);
//         }
//     }
// }
