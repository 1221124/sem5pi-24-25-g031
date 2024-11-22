using Domain.Shared;
using Domain.Users;
using Domain.Staffs;
using Xunit;
using System;

namespace DDDNetCore.Tests.Unit.Domain.Staffs
{
    public class StaffUnitTest
    {
        private readonly Staff _staff;
        private readonly User _user;
        private readonly FullName _fullName;
        private readonly ContactInformation _contactInformation; 
        private readonly Specialization _specialization;
        private readonly StaffRole _staffRole;
        private readonly Status _status;

        public StaffUnitTest()
        {
            _staff = new Staff(
                new StaffId(Guid.NewGuid()), 
                new UserId(Guid.NewGuid()),
                _fullName = new FullName("John","Doe"), 
                _contactInformation = new ContactInformation(new Email("john.doe@example.com"), new PhoneNumber("123456789")), 
                _specialization = Specialization.X_RAY,
                _staffRole = StaffRole.Technician,
                _status = Status.Active
            );
        }

        [Fact]
        public void Staff_ShouldBeCreated_WithValidData()
        {
            
            var staff = new Staff(_fullName, _contactInformation, _specialization, _staffRole);
            
            Assert.Equal(_fullName, staff.FullName);
            Assert.Equal(_contactInformation, staff.ContactInformation);
            Assert.Equal(_specialization, staff.Specialization);
            Assert.Equal(_staffRole, staff.StaffRole);
        }

        // Teste para alteração de informações de contato
        [Fact]
        public void ChangeContactInformation_ShouldUpdateContactInfo()
        {
            var newContact = new ContactInformation(new Email("new.email@example.com"), new PhoneNumber("987654321"));
            _staff.ChangeContactInformation(newContact);

            Assert.Equal("new.email@example.com", _staff.ContactInformation.Email.Value);
            Assert.Equal("987654321", _staff.ContactInformation.PhoneNumber);
        }

        // Teste para alteração de telefone
        [Fact]
        public void ChangePhoneNumber_ShouldUpdatePhoneNumber()
        {
            var newPhoneNumber = new PhoneNumber("987654321");
            _staff.ChangePhoneNumber(newPhoneNumber);

            Assert.Equal("987654321", _staff.ContactInformation.PhoneNumber);
        }

        // Teste para alteração de email
        [Fact]
        public void ChangeEmail_ShouldUpdateEmail()
        {
            var newEmail = new Email("new.email@example.com");
            _staff.ChangeEmail(newEmail);

            Assert.Equal("new.email@example.com", _staff.ContactInformation.Email.Value);
        }

        // Teste para adicionar um slot de agendamento
        [Fact]
        public void AddAppointmentSlot_ShouldAddSlotToList()
        {
            var slot = new Slot(DateTime.Now, DateTime.Now.AddHours(1));
            _staff.AddAppointmentSlot(slot);

            Assert.Single(_staff.SlotAppointement);
            Assert.Equal(slot, _staff.SlotAppointement[0]);
        }

        // Teste para adicionar um slot de disponibilidade
        [Fact]
        public void AddAvailabilitySlot_ShouldAddSlotToAvailabilityList()
        {
            var slot = new Slot(DateTime.Now, DateTime.Now.AddHours(1));
            _staff.AddAvailabilitySlot(slot);

            Assert.Single(_staff.SlotAvailability);
            Assert.Equal(slot, _staff.SlotAvailability[0]);
        }

        // Teste para alteração de especialização
        [Fact]
        public void ChangeSpecialization_ShouldUpdateSpecialization()
        {
            _staff.ChangeSpecialization(Specialization.X_RAY);

            Assert.Equal("X_RAY", _staff.Specialization.ToString());
        }

        // Teste para marcar como inativo
        [Fact]
        public void MarkAsInative_ShouldChangeStatusToInactive()
        {
            _staff.MarkAsInative();

            Assert.Equal("Inactive", _staff.Status.ToString());
        }

        // Teste para alteração de status
        [Fact]
        public void ChangeStatus_ShouldUpdateStatus()
        {
            _staff.ChangeStatus(Status.Inactive);

            Assert.Equal("Inactive", _staff.Status.ToString());
        }

        // Teste para adição de UserId
        [Fact]
        public void ChangeUserId_ShouldUpdateUserId()
        {
            var newUserId = new UserId(Guid.NewGuid());
            _staff.ChangeUserId(newUserId);

            Assert.Equal(newUserId, _staff.UserId);
        }

        // Teste para alteração de número de licença
        [Fact]
        public void ChangeLicenseNumber_ShouldUpdateLicenseNumber()
        {
            var newLicenseNumber = new LicenseNumber("12345XYZ");
            _staff.ChangeLicenseNumber(newLicenseNumber);

            Assert.Equal("12345XYZ", _staff.LicenseNumber.Value);
        }
    }
}
