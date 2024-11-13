using System;
using System.Collections.Generic;
using DDDNetCore.Domain.Patients;
using JetBrains.Annotations;
using Xunit;
using Domain.Shared;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using Moq;
using Microsoft.Extensions.DependencyInjection;
using Domain.Users;
using DDDNetCore.Tests.src.Infrastructure;
using System.Linq;
using System.Threading.Tasks;
using Domain.Emails;
using Domain.Patients;
using Microsoft.CodeAnalysis.Elfie.Serialization;

namespace DDDNetCore.Tests.src.IntegrationWithIsolation.Domain.Patients
{
    
    public class PatientServiceUnitTest: IClassFixture<TestDatabaseFixture>
    {
        
        private readonly PatientService _patientService;
        private readonly Mock<IPatientRepository> _patientRepositoryMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IEmailService> _emailServiceMock;
        private readonly TestDbContext _context;

        public PatientServiceUnitTest(TestDatabaseFixture fixture)
        {
            _context = fixture.Context;
            fixture.Reset();
            
            var serviceCollection = new ServiceCollection();
            
            _patientRepositoryMock = new Mock<IPatientRepository>();
            _patientRepositoryMock.Setup(repo => repo.GetByEmailAsync(It.IsAny<Email>()))
                .ReturnsAsync((Email email) => _context.Patients.FirstOrDefault(p=>p.ContactInformation.Email.Value == email.Value));
            
            _patientRepositoryMock.Setup(repo => repo.GetByPhoneNumberAsync(It.IsAny<PhoneNumber>()))
                .ReturnsAsync((PhoneNumber phoneNumber) => _context.Patients.FirstOrDefault(p=>p.ContactInformation.PhoneNumber.Value == phoneNumber.Value));
            
            _patientRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<Patient>()))
                .Callback((Patient patient) => _context.Patients.Add(patient))
                .ReturnsAsync((Patient patient) => patient);
            
            _patientRepositoryMock.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(()=>_context.Patients.ToList());
            
            
            
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _unitOfWorkMock.Setup(uow => uow.CommitAsync())
                .Callback(() => _context.SaveChanges())
                .ReturnsAsync(1);
            serviceCollection.AddTransient<IUnitOfWork>(_ => _unitOfWorkMock.Object);

            _emailServiceMock = new Mock<IEmailService>();
            _emailServiceMock.Setup(service => service.SendEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns(Task.CompletedTask);
            
            var emailServiceMock = new Mock<IEmailService>();
            emailServiceMock.Setup(service => service.GenerateVerificationEmailContentSensitiveInfo(It.IsAny<UpdatingPatientDto>()))
                .ReturnsAsync(("Subject Example", "Body Example"));
            
            serviceCollection.AddTransient<IEmailService>(_ => emailServiceMock.Object);
            
            serviceCollection.AddTransient<PatientService>();
            

            serviceCollection.AddTransient<IPatientRepository>(_ => _patientRepositoryMock.Object);
            var serviceProvider = serviceCollection.BuildServiceProvider();
            _patientService = serviceProvider.GetService<PatientService>();
        }
        
        [Fact]
        public async Task AddAsync_ShouldAddPatient_WhenValidDataProvided()
        {
           
            var patient = new Patient(new FullName(new Name("Guilherme"), new Name("Ribeiro")), new DateOfBirth("2004-11-17"), new ContactInformation("exemplo1@gmail.com", new PhoneNumber(913455471)), Gender.MALE); // Configure mock patient data as per your model
            
            var patientDto = await _patientService.AddAsync(patient);
            await _unitOfWorkMock.Object.CommitAsync();
            
            var allPatients = await _patientService.GetAllAsync();
            var result = await _patientRepositoryMock.Object.GetByEmailAsync(patientDto.ContactInformation.Email);
            var resultDto = new PatientDto(result.FullName, result.DateOfBirth, result.ContactInformation, result.Gender);
            
            Assert.NotNull(result);
            Assert.Equal(new FullName(new Name("Guilherme"), new Name("Ribeiro")), patientDto.FullName);
            Assert.Equal(new DateOfBirth("2004-11-17"), patientDto.DateOfBirth);
            Assert.Equal(new Email("exemplo1@gmail.com"), patientDto.ContactInformation.Email);
            Assert.Equal(new PhoneNumber(913455471), patientDto.ContactInformation.PhoneNumber);
            Assert.Equal(Gender.MALE, patientDto.Gender);
            Assert.Equal(patient, result);

            Assert.Single(allPatients);
            Assert.Equal(resultDto.FullName, patientDto.FullName);
            
        }

        [Fact]
        public async Task AddAsync_ShouldNotAddPatient_WhenPatientAlreadyExists()
        {
            var patient = new Patient(new FullName(new Name("Guilherme"), new Name("Ribeiro")),
                new DateOfBirth("2004-11-17"), new ContactInformation("exemplo2@gmail.com", new PhoneNumber(913455472)),
                Gender.MALE);

            await _patientService.AddAsync(patient);
            await _unitOfWorkMock.Object.CommitAsync();
            
            await _patientService.AddAsync(patient);
            await _unitOfWorkMock.Object.CommitAsync();
            
            var patients = await _patientService.GetAllAsync();
            
            Assert.Single(patients);
        }
        
        [Fact]
        public async Task GetAllAsync_ReturnsEmpty_WhenNoPatientsExist()
        {
            var patients = await _patientService.GetAllAsync();
            
            Assert.Empty(patients);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsAllPatients()
        {
            var patientsList = new List<Patient>
            {
                new Patient(new FullName(new Name("Guilherme"), new Name("Ribeiro")), new DateOfBirth("2004-11-17"),
                    new ContactInformation("exemplo3@gmail.com", new PhoneNumber(913455473)), Gender.MALE),
                new Patient(new FullName(new Name("Beatriz"), new Name("Silva")), new DateOfBirth("2002-11-01"),
                    new ContactInformation("exemplo4@gmail.com", new PhoneNumber(913455574)), Gender.FEMALE),
                new Patient(new FullName(new Name("João"), new Name("Santos")), new DateOfBirth("2000-11-17"),
                    new ContactInformation("exemplo5@gmail.com", new PhoneNumber(913455475)), Gender.MALE)
            };
            
            for(int i = 0; i < patientsList.Count; i++)
            {
                await _patientService.AddAsync(patientsList[i]);
                await _unitOfWorkMock.Object.CommitAsync();
            }
            
            var patients = await _patientService.GetAllAsync();
            
            //patients = patients.OrderBy(p => p.ContactInformation.PhoneNumber.Value).ToList();
            
            Assert.Equal(3, patients.Count);
            
            Assert.Equal(patientsList[0].FullName, patients[0].FullName);
            Assert.Equal(patientsList[1].FullName, patients[1].FullName);
            Assert.Equal(patientsList[2].FullName, patients[2].FullName);
            
            Assert.Equal(patientsList[0].DateOfBirth, patients[0].DateOfBirth);
            Assert.Equal(patientsList[1].DateOfBirth, patients[1].DateOfBirth);
            Assert.Equal(patientsList[2].DateOfBirth, patients[2].DateOfBirth);
        }
        
        /*
        [Fact]
        public async Task GetByIdAsync_ReturnsPatient_WhenPatientExists()
        {
            var creatingPatient = new Patient(new FullName(new Name("Guilherme"), new Name("Ribeiro")),
                new DateOfBirth("2004-11-17"),
                new ContactInformation("exemplo6@gmail.com", new PhoneNumber(913455476)), Gender.MALE);

            var patient = await _patientService.AddAsync(creatingPatient);
            await _unitOfWorkMock.Object.CommitAsync();

            var patientId = patient.Id;

            var result = await _patientService.GetByIdAsync(new PatientId(patientId));
            
            Assert.NotNull(result);
            Assert.Equal(patient.Id, patient.Id);
            Assert.Equal(patient.FullName, result.FullName);
            Assert.Equal(patient.DateOfBirth, result.DateOfBirth);
            Assert.Equal(patient.ContactInformation, result.ContactInformation);
            Assert.Equal(patient.Gender, result.Gender);
        }
        
        
        [Fact]
        public async Task DeleteAsync_ShouldDeletePatient_WhenPatientExists()
        {
            var createPatient = new Patient(new FullName(new Name("Guilherme"), new Name("Ribeiro")),
                new DateOfBirth("2004-11-17"),
                new ContactInformation("exemplo7@gmail.com", new PhoneNumber(913455477)), Gender.MALE);
            var patient = await _patientService.AddAsync(createPatient);
            await _unitOfWorkMock.Object.CommitAsync();

            var patientId = patient.Id;

            var previousPatients = await _patientService.GetAllAsync();

            await _patientService.AdminDeleteAsync(new PatientId(patientId));
            await _unitOfWorkMock.Object.CommitAsync();

            var currentPatients = await _patientService.GetAllAsync();

            Assert.Single(previousPatients);
            Assert.Empty(currentPatients);
            Assert.Null(await _patientService.GetByIdAsync(new PatientId(patientId)));
        }
        
        
        [Fact]
        public async Task DeleteAsync_ShouldNotDeletePatient_WhenPatientDoesNotExist()
        {
            var nonExistentId = new PatientId(Guid.NewGuid());

            var previousPatients = await _patientService.GetAllAsync();

            await _patientService.AdminDeleteAsync(nonExistentId);
            await _unitOfWorkMock.Object.CommitAsync();

            var currentPatients = await _patientService.GetAllAsync();

            Assert.Empty(previousPatients);
            Assert.Empty(currentPatients);
        }
        */

        [Fact]
        public async Task GetByEmailAsync_ReturnNull_WhenEmailExists()
        {
            var nonExistantEmail = new Email("exemplo8@gmail.com");
            var patient = await _patientService.GetByEmailAsync(nonExistantEmail);
            
            Assert.Null(patient);
        }

        [Fact]
        async Task GetByEmailAsync_ReturnsPatient_WhenEmailExists()
        {
            var createPatient = new Patient(new FullName(new Name("Guilherme"), new Name("Ribeiro")),
                new DateOfBirth("2004-11-17"),
                new ContactInformation("exemplo9@gmail.com", new PhoneNumber(913455479)), Gender.MALE);
            var patient = await _patientService.AddAsync(createPatient);
            await _unitOfWorkMock.Object.CommitAsync();
            
            var email = patient.ContactInformation.Email;
            
            var result = await _patientService.GetByEmailAsync(email);
            
            Assert.NotNull(result);
            Assert.Equal(patient.FullName, result.FullName);
            Assert.Equal(patient.DateOfBirth, result.DateOfBirth);
            Assert.Equal(patient.ContactInformation, result.ContactInformation);
            Assert.Equal(patient.Gender, result.Gender);
        }

    }
}
