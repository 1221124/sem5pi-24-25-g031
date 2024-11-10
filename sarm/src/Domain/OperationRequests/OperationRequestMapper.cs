namespace Domain.OperationRequests
{
    public class OperationRequestMapper {
        public static OperationRequestDto ToDto(OperationRequest operationRequest)
        {
            return new OperationRequestDto
            {
                Id = operationRequest.Id.AsGuid(),
                Staff = operationRequest.Staff,
                Patient = operationRequest.Patient,
                OperationType = operationRequest.OperationType,
                DeadlineDate = operationRequest.DeadlineDate,
                Priority = operationRequest.Priority,
                Status = operationRequest.Status
            };
        }

        public static OperationRequestDto ToDto(OperationRequestId id)
        {
            return new OperationRequestDto
            {
                Id = id.AsGuid()
            };
        }

        public static OperationRequest ToEntity(OperationRequestDto dto)
        {
            return new OperationRequest(
                dto.Id,
                dto.Staff,
                dto.Patient,
                dto.OperationType,
                dto.DeadlineDate,
                dto.Priority,
                dto.Status
            );
        }

        public static OperationRequest ToEntityFromCreating(CreatingOperationRequestDto dto) {
            return new OperationRequest(
                dto.Staff,
                dto.Patient,
                dto.OperationType,
                dto.DeadlineDate,
                dto.Priority
            );
        }

        public static OperationRequest ToEntityFromUpdating(UpdatingOperationRequestDto dto, OperationRequest operation){
            
            dto.DeadlineDate ??= operation.DeadlineDate;
            dto.Priority ??= operation.Priority;
            dto.RequestStatus ??= operation.Status;

            return new OperationRequest(
                dto.Id,
                operation.Staff,
                operation.Patient,
                operation.OperationType,
                dto.DeadlineDate,
                dto.Priority,
                dto.RequestStatus
            );

        }

        public static List<OperationRequestDto> ToDtoList(List<OperationRequest> operationRequests)
        {
            return operationRequests.ConvertAll(ToDto);
        }

        public static List<OperationRequest> ToEntityList(List<OperationRequestDto> dtoList)
        {
            return dtoList.ConvertAll(dto => ToEntity(dto));
        }
    }
}