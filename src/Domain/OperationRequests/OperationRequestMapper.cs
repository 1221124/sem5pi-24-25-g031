using System.Collections.Generic;
using Domain.OperationTypes;
using Domain.Patients;
using Domain.Shared;
using Domain.Staffs;

namespace Domain.OperationRequests
{
    public class OperationRequestMapper {
        public static OperationRequestDto ToDto(OperationRequest operationRequest)
        {
            return new OperationRequestDto
            {
                Id = operationRequest.Id.AsGuid(),
                DoctorId = operationRequest.DoctorId,
                PatientId = operationRequest.PatientId,
                OperationTypeId = operationRequest.OperationTypeId,
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
                dto.DoctorId,
                dto.PatientId,
                dto.OperationTypeId,
                dto.DeadlineDate,
                dto.Priority,
                dto.Status
            );
        }

        public static OperationRequest ToEntityFromCreating(CreatingOperationRequestDto dto) {
            return new OperationRequest(
                new StaffId(new Guid(dto.StaffId)),
                new PatientId(dto.PatientId),
                new OperationTypeId(dto.OperationTypeId),
                DateTime.Parse(dto.DeadlineDate),
                PriorityUtils.FromString(dto.Priority)
            );
        }

        public static List<OperationRequestDto> ToDtoList(List<OperationRequest> operationRequests)
        {
            return operationRequests.ConvertAll(ToDto);
        }

        public static List<OperationRequestDto> ToDtoList(List<Task> list)
        {
            return [];
        }

        public static List<OperationRequestDto> ToDtoList()
        {
            return [];
        }

        public static List<OperationRequest> ToEntityList(List<OperationRequestDto> dtoList)
        {
            return dtoList.ConvertAll(dto => ToEntity(dto));
        }
    }
}