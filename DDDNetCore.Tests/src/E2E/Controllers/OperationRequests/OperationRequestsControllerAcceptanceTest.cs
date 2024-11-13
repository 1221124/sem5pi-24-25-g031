// using System;
// using System.Collections.Generic;
// using System.Threading.Tasks;
// using DDDNetCore.Controllers;
// using DDDNetCore.Domain.OperationRequests;
// using Domain.DbLogs;
// using Domain.OperationRequests;
// using Domain.OperationTypes;
// using Domain.Patients;
// using Domain.Shared;
// using Domain.Staffs;
// using Microsoft.AspNetCore.Mvc;
// using Moq;
// using Xunit;
// using IOperationRequestService = DDDNetCore.Domain.OperationRequests.IOperationRequestService;

// namespace E2E.Controllers.OperationRequests
// {
//     public class OperationRequestControllerAcceptanceTest
//     {

//         private const string PageNumber = "1";
        
//         private readonly OperationRequestController _controller;
//         private readonly Mock<OperationRequestService> _service = new Mock<OperationRequestService>();
//         private readonly Mock<DbLogService> _logService = new Mock<DbLogService>();

//         public OperationRequestControllerAcceptanceTest()
//         {
//             // Setup mocks and controller
//             _controller = new OperationRequestController(_service.Object, _logService.Object);

//             _service.Setup(x => x.GetAllAsync())
//                 .ReturnsAsync(new List<OperationRequestDto>());

//             _service.Setup(x => x.GetByIdAsync(It.IsAny<OperationRequestId>()))
//                 .ReturnsAsync(new OperationRequestDto());

//             _service.Setup(x => x.AddAsync(It.IsAny<CreatingOperationRequestDto>()))
//                 .ReturnsAsync(new OperationRequestDto());

//             _service.Setup(x => x.UpdateAsync(It.IsAny<UpdatingOperationRequestDto>()))
//                 .ReturnsAsync(new OperationRequestDto());

//             _service.Setup(x => x.DeleteAsync(It.IsAny<OperationRequestId>()))
//                 .ReturnsAsync(new OperationRequestDto());

//             _service.Setup(x => x.GetByRequestStatusAsync(It.IsAny<RequestStatus>()))
//                 .ReturnsAsync(new List<OperationRequestDto>());

//             _service.Setup(x => x.GetByOperationTypeAsync(It.IsAny<OperationTypeId>()))
//                 .ReturnsAsync(new List<OperationRequestDto>());

//             _service.Setup(x => x.GetByPatientNameAsync(It.IsAny<FullName>()))
//                 .ReturnsAsync(new List<OperationRequestDto>());
//         }

//         //GetAll
//         [Fact]
//         public async Task Get_ShouldReturnOk_NoOperationRequests()
//         {
//             // Act
//             var result = await _controller.Get(null);

//             // Assert
//             var okResult = Assert.IsType<OkObjectResult>(result.Result); // Check if result is OkObjectResult
//             var returnValue = Assert.IsAssignableFrom<IEnumerable<OperationRequestDto>>(okResult.Value);
//             Assert.Empty(returnValue);
//         }

//         [Fact]
//         public async Task Get_ShouldReturnOk_WithOperationRequest()
//         {
//             // Arrange
//             var list = new List<OperationRequestDto>{
//                 new OperationRequestDto(
//                     new Guid(),
//                     new PatientId(Guid.NewGuid()),
//                     new StaffId(Guid.NewGuid()),
//                     new OperationTypeId(Guid.NewGuid()),
//                     new DeadlineDate(),
//                     Priority.URGENT,
//                     RequestStatus.PENDING
//                 ),
                
//                 new OperationRequestDto(
//                     new Guid(),
//                     new PatientId(Guid.NewGuid()),
//                     new StaffId(Guid.NewGuid()),
//                     new OperationTypeId(Guid.NewGuid()),
//                     new DeadlineDate(),
//                     Priority.ELECTIVE,
//                     RequestStatus.PENDING
//                 )
//             };
            
//             _service.Setup(x => x.GetAllAsync()).ReturnsAsync(() => list); 
            
//             // Act
//             var result = await _controller.Get(null);
            
//             // Assert
//             Assert.IsType<OkObjectResult>(result.Result);
//         }

//         [Fact]
//         public async Task Get_ShouldReturnBadRequest_InvalidPageNumber()
//         {
//             // Act
//             var result = await _controller.Get("invalidPageNumber");

//             // Assert
//             Assert.IsType<BadRequestObjectResult>(result.Result);
//         }

//         //GetById
//         [Fact]
//         public async Task GetById_ShouldReturnNotFound_NonexistentId()
//         {
//             // Arrange
//             _service.Setup(x => x.GetByIdAsync(It.IsAny<OperationRequestId>()))
//                 .ReturnsAsync((OperationRequestDto)null);

//             // Act
//             var result = await _controller.GetById(Guid.NewGuid());

//             // Assert
//             Assert.IsType<NotFoundResult>(result.Result);
//         }

//         [Fact]
//         public async Task GetById_ShouldReturnOk_ExistingId()
//         {
//             // Arrange
//             var request = new OperationRequestDto(
//                 new Guid()
//             );
            
//             _service.Setup(x => x.GetByIdAsync(It.IsAny<OperationRequestId>()))
//                 .ReturnsAsync(request);

//             // Act
//             var result = await _controller.GetById(request.Id);
            
//             // Assert
//             Assert.IsType<OkObjectResult>(result.Result);
//         }
        
//         //GetByPatientName
//         [Fact]
//         public async Task GetByPatientName_ShouldReturnBadRequest_InvalidNameFormat()
//         {
//             // Act
//             var result = await _controller.GetByPatientName("InvalidName", null);

//             // Assert
//             Assert.IsType<BadRequestObjectResult>(result.Result);
//         }

//         [Fact]
//         public async Task GetByPatientName_ShouldReturnOk_ExistingPatientName()
//         {
//             // Arrange
//             var request = new OperationRequestDto(
//                     new Guid(),
//                     new PatientId(Guid.NewGuid()),
//                     new StaffId(Guid.NewGuid()),
//                     new OperationTypeId(Guid.NewGuid()),
//                     new DeadlineDate(),
//                     Priority.ELECTIVE,
//                     RequestStatus.PENDING
//                 );
            
//             var patient = new PatientDto(
//                 request.PatientId.AsGuid(),
//                 new FullName("John", "Doe")
//                 );
            
//             var list = new List<OperationRequestDto> { request };
            
//             _service.Setup(x => x.GetByPatientNameAsync(It.IsAny<FullName>()))
//                 .ReturnsAsync(() => list);
            
//             // Act
//             var result = await _controller.GetByPatientName(patient.FullName.FirstName + "-" + patient.FullName.LastName, null);
            
//             // Assert
//             Assert.IsType<OkObjectResult>(result.Result);
//         }
        
//         [Fact]
//         public async Task GetByPatientName_ShouldReturnNotFound_NonExistingPatientName()
//         {
//             // Arrange
//           var patient = new PatientDto(
//                 (new PatientId(Guid.NewGuid())).AsGuid(),
//                 new FullName("John", "Doe")
//             );
          
//             _service.Setup(x => x.GetByPatientNameAsync(It.IsAny<FullName>()))
//                 .ReturnsAsync(() => []);
            
//             // Act
//             var result = await _controller.GetByPatientName(patient.FullName.LastName + "-" + patient.FullName.FirstName, null);
            
//             // Assert
//             Assert.IsType<NotFoundResult>(result.Result);
//         }
        
//         //Update

        
//         //Create
//         [Fact]
//         public async Task Create_ShouldReturnBadRequest_NullDto()
//         {
//             // Act
//             var result = await _controller.Create(null);

//             // Assert
//             Assert.IsType<BadRequestObjectResult>(result.Result);
//         }

//         //Delete
//         [Fact]
//         public async Task Delete_ShouldReturnOk_SuccessfulDeletion()
//         {
//             // Act
//             var result = await _controller.Delete(Guid.NewGuid());

//             // Assert
//             var okResult = Assert.IsType<OkObjectResult>(result.Result);
//             Assert.IsType<OkObjectResult>(result.Result);
//         }
//     }
// }
