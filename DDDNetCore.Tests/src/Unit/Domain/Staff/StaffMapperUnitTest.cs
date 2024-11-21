using Xunit;
using System;
using System.Collections.Generic;
using Domain.Staffs;
using Domain.Shared;
using Domain.Users;

namespace DDDNetCore.Tests.src.Unit.Domain.Staffs
{
    public class StaffMapperUnitTest
    {
        private readonly Staff _staff;
        private readonly StaffDto _staffDto;
        private readonly CreatingStaffDto _creatingStaffDto;

        public StaffMapperUnitTest()
        {
            // Staff de exemplo para testes
            _staff = new Staff(
                new StaffId(Guid.NewGuid()),
                new UserId(Guid.NewGuid()),
                new FullName("John", "Doe"),
                new ContactInformation(new Email("john.doe@example.com"), new PhoneNumber("123456789")),
                Specialization.CARDIOLOGY,
                StaffRole.Doctor,
                Status.Active
            );

            // StaffDto correspondente
            _staffDto = new StaffDto
            {
                Id = _staff.Id.AsGuid(),
                UserId = _staff.UserId,
                FullName = _staff.FullName,
                LicenseNumber = _staff.LicenseNumber,
                Specialization = _staff.Specialization,
                ContactInformation = _staff.ContactInformation,
                StaffRole = _staff.StaffRole,
                Status = _staff.Status,
                SlotAppointement = _staff.SlotAppointement,
                SlotAvailability = _staff.SlotAvailability
            };

            _creatingStaffDto = new CreatingStaffDto(
                new FullName("Jane", "Doe"),   
                new PhoneNumber("123456789"),                 
                new Email("jane.smith@example.com"),   
                Specialization.X_RAY,                  
                StaffRole.Doctor                       
            );
        }

        [Fact]
        public void ToDto_ShouldConvertStaffToStaffDto()
        {
            var dto = StaffMapper.ToDto(_staff);

            Assert.Equal(_staff.Id.AsGuid(), dto.Id);
            Assert.Equal(_staff.UserId, dto.UserId);
            Assert.Equal(_staff.FullName, dto.FullName);
            Assert.Equal(_staff.LicenseNumber, dto.LicenseNumber);
            Assert.Equal(_staff.Specialization, dto.Specialization);
            Assert.Equal(_staff.ContactInformation, dto.ContactInformation);
            Assert.Equal(_staff.StaffRole, dto.StaffRole);
            Assert.Equal(_staff.Status, dto.Status);
            Assert.Equal(_staff.SlotAppointement, dto.SlotAppointement);
            Assert.Equal(_staff.SlotAvailability, dto.SlotAvailability);
        }

        [Fact]
        public void ToEntity_ShouldConvertStaffDtoToStaff()
        {
            var entity = StaffMapper.ToEntity(_staffDto);

            Assert.Equal(_staffDto.Id, entity.Id.AsGuid());
            Assert.Equal(_staffDto.UserId, entity.UserId);
            Assert.Equal(_staffDto.FullName, entity.FullName);
            Assert.Equal(_staffDto.ContactInformation, entity.ContactInformation);
            Assert.Equal(_staffDto.Specialization, entity.Specialization);
            Assert.Equal(_staffDto.StaffRole, entity.StaffRole);
            Assert.Equal(_staffDto.Status, entity.Status);
        }

        [Fact]
        public void ToEntityFromCreating_ShouldConvertCreatingStaffDtoToStaff()
        {
            var entity = StaffMapper.ToEntityFromCreating(_creatingStaffDto);
            
            Assert.Equal(_creatingStaffDto.FullName, entity.FullName);
            Assert.Equal(_creatingStaffDto.Email, entity.ContactInformation.Email);
            Assert.Equal(_creatingStaffDto.PhoneNumber, entity.ContactInformation.PhoneNumber);
            Assert.Equal(_creatingStaffDto.Specialization, entity.Specialization);
            Assert.Equal(_creatingStaffDto.StaffRole, entity.StaffRole);
        }

        [Fact]
        public void ToDtoList_ShouldConvertStaffListToDtoList()
        {
            var staffList = new List<Staff> { _staff };
            var dtoList = StaffMapper.ToDtoList(staffList);

            Assert.Single(dtoList);
            Assert.Equal(_staff.Id.AsGuid(), dtoList[0].Id);
            Assert.Equal(_staff.FullName, dtoList[0].FullName);
        }

        [Fact]
        public void ToDtoList_ShouldReturnEmptyList_WhenInputListIsEmpty()
        {
            var dtoList = StaffMapper.ToDtoList(new List<Staff>());

            Assert.Empty(dtoList);
        }

        [Fact]
        public void ToDtoList_ShouldReturnNull_WhenInputListIsNull()
        {
            var dtoList = StaffMapper.ToDtoList(null);

            Assert.Null(dtoList);
        }

        [Fact]
        public void ToEntityList_ShouldConvertDtoListToStaffList()
        {
            var dtoList = new List<StaffDto> { _staffDto };
            var entityList = StaffMapper.ToEntityList(dtoList);

            Assert.Single(entityList);
            Assert.Equal(_staffDto.Id, entityList[0].Id.AsGuid());
            Assert.Equal(_staffDto.FullName, entityList[0].FullName);
        }

        [Fact]
        public void ToEntityList_ShouldReturnEmptyList_WhenInputListIsEmpty()
        {
            var entityList = StaffMapper.ToEntityList(new List<StaffDto>());

            Assert.Empty(entityList);
        }

        [Fact]
        public void ToEntityList_ShouldReturnNull_WhenInputListIsNull()
        {
            var entityList = StaffMapper.ToEntityList(null);

            Assert.Null(entityList);
        }

        [Fact]
        public void ToEntityFromUpdating_ShouldConvertStaffDtoToUpdatingStaffDto()
        {
            var updatingDto = StaffMapper.ToEntityFromUpdating(_staffDto);

            Assert.Equal(_staffDto.ContactInformation.Email, updatingDto.Email);
            Assert.Equal(_staffDto.ContactInformation.PhoneNumber, updatingDto.PhoneNumber);
            Assert.Equal(_staffDto.SlotAvailability, updatingDto.AvailabilitySlots);
            Assert.Equal(_staffDto.Specialization, updatingDto.Specialization);
        }
    }
}