using System.Collections.Generic;

namespace Domain.OperationTypes
{
    public class OperationTypeMapper
    {
        public static OperationTypeDto ToDto(OperationType operationType)
        {
            return new OperationTypeDto
            {
                Name = operationType.Name,
                Specialization = operationType.Specialization,
                _requiredStaff = operationType._requiredStaff,
                PhasesDuration = operationType.PhasesDuration,
                status = operationType.Status
            };
        }

        public static OperationType ToEntity(CreatingOperationTypeDto creatingOperationTypeDto)
        {
            return new OperationType(
                creatingOperationTypeDto.Name,
                creatingOperationTypeDto.Specialization,
                creatingOperationTypeDto._requiredStaff,
                creatingOperationTypeDto.PhasesDuration
            );
        }

        public static List<OperationTypeDto> ToDtoList(List<OperationType> operationTypes)
        {
            return operationTypes.ConvertAll(operationType => ToDto(operationType));
        }

        public static List<OperationType> ToEntityList(List<CreatingOperationTypeDto> creatingOperationTypeDtos)
        {
            return creatingOperationTypeDtos.ConvertAll(creatingOperationTypeDto => ToEntity(creatingOperationTypeDto));
        }
    }
}