using Xunit;
using System.Threading.Tasks;
using DDDNetCore.Domain.Patients;
using DDDNetCore.Infrastructure.Patients;
using Domain.Shared;
using Microsoft.Extensions.DependencyInjection;
using Domain.Users;
using Infrastructure.Users;
using DDDNetCore.Tests.Infrastructure;
using Domain.Emails;
using Domain.Patients;
using Moq;


namespace DDDNetCore.Tests.Domain.Patients
{
    public class PatientServiceIntegrationTests: IClassFixture<TestDatabaseFixture>
    {
        private readonly PatientService _service;
        private readonly TestDbContext _context;
        private readonly Mock<IEmailService> _emailServiceMock;
        
        public PatientServiceIntegrationTests(TestDatabaseFixture fixture)
        {
            _context = fixture.Context;
            fixture.Reset();
            
            var serviceCollection = new ServiceCollection();
            
            serviceCollection.AddTransient<IPatientRepository, PatientRepository>(provider =>
                new PatientRepository(_context));
            
            serviceCollection.AddTransient<IUnitOfWork, TestUnitOfWork>(provider =>
                new TestUnitOfWork(_context));
            
            
            _emailServiceMock = new Mock<IEmailService>();
            _emailServiceMock.Setup(service => service.SendEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns(Task.CompletedTask);
            
            var emailServiceMock = new Mock<IEmailService>();
            emailServiceMock.Setup(service => service.GenerateVerificationEmailContentSensitiveInfo(It.IsAny<UpdatingPatientDto>()))
                .ReturnsAsync(("Subject Example", "Body Example"));
            
            serviceCollection.AddTransient<IEmailService>(_ => emailServiceMock.Object);
            
            serviceCollection.AddTransient<PatientService>();
            var serviceProvider = serviceCollection.BuildServiceProvider();
            _service = serviceProvider.GetService<PatientService>();
            
        }

        [Fact]
        public async Task Create_NotRegistered_WhenPatientAlreadyExistsAsync()
        {
            var createPatient = new Patient(new FullName(new Name("Guilherme"), new Name("Ribeiro")),
                new DateOfBirth("2004-11-17"),
                new ContactInformation("exemplo1@gmail.com", new PhoneNumber(913455471)), Gender.MALE);

            await _service.AddAsync(createPatient);
            await _context.SaveChangesAsync();

            await _service.AddAsync(createPatient);
            await _context.SaveChangesAsync();
            
            var patients = await _service.GetAllAsync();
            
            Assert.Single(patients);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnUser_WhenIdExists()
        {
            var creatingPatient = new Patient(new FullName(new Name("Guilherme"), new Name("Ribeiro")),
                new DateOfBirth("2004-11-17"),
                new ContactInformation("exemplo2@gmail.com", new PhoneNumber(913455472)), Gender.MALE);
            
            var createdPatient = await _service.AddAsync(creatingPatient);
            await _context.SaveChangesAsync();
            
            var patientId = createdPatient.Id;
            var patient = await _service.GetByIdAsync(new PatientId(patientId));
            
            Assert.NotNull(patient);
            Assert.Equal(createdPatient.FullName, patient.FullName);
            Assert.Equal(createdPatient.DateOfBirth, patient.DateOfBirth);
            Assert.Equal(createdPatient.ContactInformation, patient.ContactInformation);
            Assert.Equal(createdPatient.Gender, patient.Gender);

        }

        [Fact]
        public async Task GetAllAsync_ReturnsAllPatients()
        {
            var creatingPatient1 = new Patient(new FullName(new Name("Guilherme"), new Name("Ribeiro")),
                new DateOfBirth("2004-11-17"),
                new ContactInformation("exemplo3@gmail.com", new PhoneNumber(913455473)), Gender.MALE);
            var creatingPatient2 = new Patient(new FullName(new Name("Guilherme"), new Name("Ribeiro")),
                new DateOfBirth("2004-11-17"),
                new ContactInformation("exemplo4@gmail.com", new PhoneNumber(913455474)), Gender.MALE);

            await _service.AddAsync(creatingPatient1);
            await _context.SaveChangesAsync();
            await _service.AddAsync(creatingPatient2);
            await _context.SaveChangesAsync();
            
            var patients = await _service.GetAllAsync();    
            
            Assert.NotNull(patients);
            Assert.Equal(2, patients.Count);
            Assert.Contains(patients, p => p.ContactInformation.Email.Value == "exemplo3@gmail.com");
            Assert.Contains(patients, p => p.ContactInformation.Email.Value == "exemplo4@gmail.com");
        }

        [Fact]
        public async Task DeleteAsync_DeletePatientFromDatabase()
        {
            var creatingPatient = new Patient(new FullName(new Name("Guilherme"), new Name("Ribeiro")),
                new DateOfBirth("2004-11-17"),
                new ContactInformation("exemplo5@gmail.com", new PhoneNumber(913455475)), Gender.MALE);
            var createdPatient = await _service.AddAsync(creatingPatient);
            await _context.SaveChangesAsync();

            var patientId = createdPatient.Id;
            await _service.AdminDeleteAsync(new PatientId(patientId));
            await _context.SaveChangesAsync();

            var patients = await _service.GetAllAsync();

            Assert.Empty(patients);
        }
    }
}

