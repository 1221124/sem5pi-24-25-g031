
namespace DDDNetCore.Domain.OperationRequests
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
                Status = operationRequest.Status,
                RequestCode = operationRequest.RequestCode
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
                dto.Status,
                dto.RequestCode
            );
        }

        public static OperationRequest ToEntityFromCreating(CreatingOperationRequestDto dto, RequestCode requestCode) {
            return new OperationRequest(
                dto.Staff,
                dto.Patient,
                dto.OperationType,
                dto.DeadlineDate,
                dto.Priority,
                requestCode
            );
        }

        public static OperationRequest ToEntityFromCreating(CreatingOperationRequestDto dto) {
            return new OperationRequest(
                dto.Staff,
                dto.Patient,
                dto.OperationType,
                dto.DeadlineDate,
                dto.Priority,
                new RequestCode("req0")
            );
        }

        public static OperationRequest ToEntityFromUpdating(UpdatingOperationRequestDto dto, OperationRequest operation){

            return new OperationRequest(
                dto.Id,
                operation.Staff,
                operation.Patient,
                operation.OperationType,
                dto.DeadlineDate,
                dto.Priority,
                dto.RequestStatus,
                operation.RequestCode
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

        public static UpdatingOperationRequestDto ToUpdatingFromEntity(OperationRequestDto operationRequestDto, RequestStatus requestStatus)
        {
            return new UpdatingOperationRequestDto
            {
                Id = operationRequestDto.Id,
                DeadlineDate = operationRequestDto.DeadlineDate,
                Priority = operationRequestDto.Priority,
                RequestStatus = requestStatus
            };
        }
    }
}