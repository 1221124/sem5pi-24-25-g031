using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDNetCore.Tests.src.Infrastructure;
using Domain.Shared;
using Domain.Staffs;
using Domain.Users;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;

namespace DDDNetCore.Tests.src.IntegrationWithoutIsolation.Domain.Staffs
{
    public class StaffServiceUnitTest : IClassFixture<TestDatabaseFixture>
    {
        private readonly StaffService _staffService;
        private readonly Mock<IStaffRepository> _staffRepositoryMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;

        public StaffServiceUnitTest()
        {
            var serviceCollection = new ServiceCollection();

            _staffRepositoryMock = new Mock<IStaffRepository>();
            _unitOfWorkMock = new Mock<IUnitOfWork>();

            serviceCollection.AddTransient<IStaffRepository>(_ => _staffRepositoryMock.Object);
            serviceCollection.AddTransient<IUnitOfWork>(_ => _unitOfWorkMock.Object);

            serviceCollection.AddTransient<StaffService>();

            var serviceProvider = serviceCollection.BuildServiceProvider();
            _staffService = serviceProvider.GetService<StaffService>();
        }

        private CreatingStaffDto CreateSampleStaffDto(string email, string firstName = "Test", string lastName = "Staff")
        {
            return new CreatingStaffDto(
                new FullName(firstName, lastName),
                new PhoneNumber("123456789"),
                new Email(email),
                SpecializationUtils.FromString("CARDIOLOGY"),
                StaffRole.Doctor
            );
        }

        [Fact]
        public async Task GetAllAsync_ReturnsAllStaffs()
        {
            var staffList = new List<Staff>
            {
                new Staff(
                    new LicenseNumber("L123"),
                    new FullName("John", "Doe"),
                    new ContactInformation(new Email("test1@example.com"), new PhoneNumber("123456789")),
                    Specialization.CARDIOLOGY,
                    StaffRole.Doctor
                ),
                new Staff(
                    new LicenseNumber("L456"),
                    new FullName("Jane", "Doe"),
                    new ContactInformation(new Email("test2@example.com"), new PhoneNumber("987654321")),
                    Specialization.CARDIOLOGY,
                    StaffRole.Doctor
                )
            };

            _staffRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(staffList);

            var result = await _staffService.GetAllAsync();

            Assert.Equal(2, result.Count());
            Assert.Equal("test1@example.com", result.First().ContactInformation.Email.Value);
            Assert.Equal("test2@example.com", result.Last().ContactInformation.Email.Value);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsStaff_WhenIdExists()
        {
            var staffId = new StaffId(Guid.NewGuid());
            var userId = new UserId(Guid.NewGuid());
            var fullName = new FullName("John", "Doe");
            var contactInformation = new ContactInformation(new Email("test@example.com"), new PhoneNumber("123456789"));
            var specialization = Specialization.CARDIOLOGY;
            var staffRole = StaffRole.Doctor;
            var status = Status.Active;

            var staff = new Staff(staffId, userId, fullName, contactInformation, specialization, staffRole, status);

            _staffRepositoryMock.Setup(repo => repo.GetByIdAsync(staffId)).ReturnsAsync(staff);

            var result = await _staffService.GetByIdAsync(staffId);

            Assert.NotNull(result);
            Assert.Equal("test@example.com", result.ContactInformation.Email.Value);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsNull_WhenIdDoesNotExist()
        {
            var staffId = new StaffId(Guid.NewGuid());

            _staffRepositoryMock.Setup(repo => repo.GetByIdAsync(staffId)).ReturnsAsync((Staff)null);

            var result = await _staffService.GetByIdAsync(staffId);

            Assert.Null(result);
        }

        [Fact]
        public async Task GetByEmailAsync_ReturnsStaff_WhenEmailExists()
        {
            var email = new Email("test@example.com");
            var staffId = new StaffId(Guid.NewGuid());
            var fullName = new FullName("John", "Doe");
            var contactInformation = new ContactInformation(email, new PhoneNumber("123456789"));
            var specialization = Specialization.CARDIOLOGY;

            var staff = new Staff(staffId, null, fullName, contactInformation, specialization, StaffRole.Doctor, Status.Active);

            _staffRepositoryMock.Setup(repo => repo.GetByEmailAsync(email)).ReturnsAsync(staff);

            var result = await _staffService.GetByEmailAsync(email);

            Assert.NotNull(result);
            Assert.Equal(email, result.ContactInformation.Email);
        }

        [Fact]
        public async Task GetByEmailAsync_ReturnsNull_WhenEmailDoesNotExist()
        {
            var email = new Email("emailNotExists@example.com");

            _staffRepositoryMock.Setup(repo => repo.GetByEmailAsync(email)).ReturnsAsync((Staff)null);

            var result = await _staffService.GetByEmailAsync(email);

            Assert.Null(result);
        }
    }
}
