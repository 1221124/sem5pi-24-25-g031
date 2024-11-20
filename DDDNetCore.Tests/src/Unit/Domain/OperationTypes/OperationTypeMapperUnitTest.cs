using Xunit;
using System;
using System.Collections.Generic;
using Domain.OperationTypes;
using Domain.Shared;

namespace DDDNetCore.Tests.src.Unit.Domain.OperationTypes
{
    public class OperationTypeMapperUnitTest
    {
        private readonly OperationType _operationType;
        private readonly OperationTypeDto _operationTypeDto;
        private readonly CreatingOperationTypeDto _creatingOperationTypeDto;

        public OperationTypeMapperUnitTest()
        {
            _operationType = new OperationType(
                Guid.NewGuid(),
                new Name("Example Operation"),
                Specialization.CARDIOLOGY,
                new List<RequiredStaff>
                {
                    new RequiredStaff(Role.Doctor, Specialization.CARDIOLOGY, new Quantity(1)),
                    new RequiredStaff(Role.Nurse, Specialization.ANAESTHESIOLOGY, new Quantity(2))
                },
                new PhasesDuration(30, 60, 20),
                Status.Active
            );

            _operationTypeDto = new OperationTypeDto
            {
                Id = _operationType.Id.AsGuid(),
                Name = _operationType.Name,
                Specialization = _operationType.Specialization,
                RequiredStaff = _operationType.RequiredStaff,
                PhasesDuration = _operationType.PhasesDuration,
                Status = _operationType.Status
            };

            _creatingOperationTypeDto = new CreatingOperationTypeDto(
                _operationType.Name,
                _operationType.Specialization,
                _operationType.RequiredStaff,
                _operationType.PhasesDuration
            );
        }

        [Fact]
        public void ToDto_ShouldConvertOperationTypeToDto()
        {
            var dto = OperationTypeMapper.ToDto(_operationType);

            Assert.Equal(_operationType.Id.AsGuid(), dto.Id);
            Assert.Equal(_operationType.Name, dto.Name);
            Assert.Equal(_operationType.Specialization, dto.Specialization);
            Assert.Equal(_operationType.RequiredStaff, dto.RequiredStaff);
            Assert.Equal(_operationType.PhasesDuration, dto.PhasesDuration);
            Assert.Equal(_operationType.Status, dto.Status);
        }

        [Fact]
        public void ToEntity_ShouldConvertDtoToOperationType()
        {
            var entity = OperationTypeMapper.ToEntity(_operationTypeDto);

            Assert.Equal(_operationTypeDto.Id, entity.Id.AsGuid());
            Assert.Equal(_operationTypeDto.Name, entity.Name);
            Assert.Equal(_operationTypeDto.Specialization, entity.Specialization);
            Assert.Equal(_operationTypeDto.RequiredStaff, entity.RequiredStaff);
            Assert.Equal(_operationTypeDto.PhasesDuration, entity.PhasesDuration);
            Assert.Equal(_operationTypeDto.Status, entity.Status);
        }

        [Fact]
        public void ToEntityFromCreating_ShouldConvertCreatingOperationTypeDtoToOperationType()
        {
            var entity = OperationTypeMapper.ToEntityFromCreating(_creatingOperationTypeDto);

            Assert.NotEqual(Guid.Empty, entity.Id.AsGuid()); // A new Guid should be generated
            Assert.Equal(_creatingOperationTypeDto.Name, entity.Name);
            Assert.Equal(_creatingOperationTypeDto.Specialization, entity.Specialization);
            Assert.Equal(_creatingOperationTypeDto.RequiredStaff, entity.RequiredStaff);
            Assert.Equal(_creatingOperationTypeDto.PhasesDuration, entity.PhasesDuration);
            Assert.Equal(Status.Active, entity.Status); // Default status should be Active
        }

        [Fact]
        public void ToDtoList_ShouldConvertOperationTypeListToDtoList()
        {
            var operationTypes = new List<OperationType> { _operationType };
            var dtoList = OperationTypeMapper.ToDtoList(operationTypes);

            Assert.Single(dtoList);
            Assert.Equal(_operationType.Id.AsGuid(), dtoList[0].Id);
            Assert.Equal(_operationType.Name, dtoList[0].Name);
        }

        [Fact]
        public void ToDtoList_ShouldReturnEmptyList_WhenInputListIsEmpty()
        {
            var dtoList = OperationTypeMapper.ToDtoList(new List<OperationType>());

            Assert.Empty(dtoList);
        }

        [Fact]
        public void ToDtoList_ShouldReturnNull_WhenInputListIsNull()
        {
            var dtoList = OperationTypeMapper.ToDtoList(null);

            Assert.Null(dtoList);
        }

        [Fact]
        public void ToEntityList_ShouldConvertDtoListToOperationTypeList()
        {
            var dtoList = new List<OperationTypeDto> { _operationTypeDto };
            var entityList = OperationTypeMapper.ToEntityList(dtoList);

            Assert.Single(entityList);
            Assert.Equal(_operationTypeDto.Id, entityList[0].Id.AsGuid());
            Assert.Equal(_operationTypeDto.Name, entityList[0].Name);
        }

        [Fact]
        public void ToEntityList_ShouldReturnEmptyList_WhenInputListIsEmpty()
        {
            var entityList = OperationTypeMapper.ToEntityList(new List<OperationTypeDto>());

            Assert.Empty(entityList);
        }

        [Fact]
        public void ToEntityList_ShouldReturnNull_WhenInputListIsNull()
        {
            var entityList = OperationTypeMapper.ToEntityList(null);

            Assert.Null(entityList);
        }
    }
}