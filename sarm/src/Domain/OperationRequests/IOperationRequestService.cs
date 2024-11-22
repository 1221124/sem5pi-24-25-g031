using Domain.OperationTypes;
using Domain.Shared;

namespace DDDNetCore.Domain.OperationRequests
{
    
    public interface IOperationRequestService
    {
        Task<OperationRequestDto?> AddAsync(CreatingOperationRequestDto operationRequest);
        Task<OperationRequestDto?> UpdateAsync(UpdatingOperationRequestDto dto);
        Task<OperationRequestDto?> GetByIdAsync(OperationRequestId id);
        Task<List<OperationRequestDto>> GetAllAsync();
        Task<List<OperationRequestDto>?> GetByRequestStatusAsync(RequestStatus status);
        Task<List<OperationRequestDto>?> GetByOperationTypeAsync(OperationTypeId id);
        Task<List<OperationRequestDto>?> GetByPatientNameAsync(FullName name);
        Task<OperationRequestDto?> DeleteAsync (OperationRequestId id);
}
}