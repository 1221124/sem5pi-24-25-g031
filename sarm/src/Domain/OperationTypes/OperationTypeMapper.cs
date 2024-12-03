namespace Domain.OperationTypes
{
    public class OperationTypeMapper
    {
        public static OperationTypeDto ToDto(OperationType operationType)
        {
            return new OperationTypeDto
            {
                Id = operationType.Id.AsGuid(),
                OperationTypeCode = operationType.OperationTypeCode,
                Name = operationType.Name,
                Specialization = operationType.Specialization,
                RequiredStaff = operationType.RequiredStaff,
                PhasesDuration = operationType.PhasesDuration,
                Status = operationType.Status,
                Version = operationType.Version
            };
        }

        public static OperationType ToEntity(OperationTypeDto dto)
        {
            return new OperationType(
                dto.OperationTypeCode,
                dto.Name,
                dto.Specialization,
                dto.RequiredStaff,
                dto.PhasesDuration,
                dto.Status,
                dto.Version
            );
        }

        public static OperationType ToEntityFromCreating(CreatingOperationTypeDto dto, OperationTypeCode operationTypeCode) {
            return new OperationType(
                operationTypeCode,
                dto.Name,
                dto.Specialization,
                dto.RequiredStaff,
                dto.PhasesDuration
            );
        }

        public static List<OperationTypeDto> ToDtoList(List<OperationType> operationTypes)
        {
            if (operationTypes == null)
            {
                return null;
            } else if (operationTypes.Count == 0)
            {
                return new List<OperationTypeDto>();
            } else {
                return operationTypes.ConvertAll(operationType => ToDto(operationType));
            }
        }

        public static List<OperationType> ToEntityList(List<OperationTypeDto> dtoList)
        {
            if (dtoList == null)
            {
                return null;
            } else if (dtoList.Count == 0)
            {
                return new List<OperationType>();
            } else {
                return dtoList.ConvertAll(dto => ToEntity(dto));
            }
        }
    }
}