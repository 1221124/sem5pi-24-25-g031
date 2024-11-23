using Domain.Patients;
using Domain.DbLogs;
using Domain.Shared;
using Domain.OperationTypes;
using Domain.Staffs;
using DDDNetCore.Domain.Patients;
using System.Linq;
using Azure.Core;
using Google.Type;

namespace DDDNetCore.Domain.OperationRequests
{
    public class OperationRequestService /*: IOperationRequestService*/
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationRequestRepository _repo;
        private readonly PatientService _patientService;
        private readonly OperationTypeService _operationTypeService;
        private readonly StaffService _staffService;
        private readonly DbLogService _logService;

        public OperationRequestService(IUnitOfWork unitOfWork, IOperationRequestRepository repo,
        PatientService patientService, OperationTypeService operationTypeService, DbLogService logService,
        StaffService staffService)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            _patientService = patientService;
            _operationTypeService = operationTypeService;
            _logService = logService;
            _staffService = staffService;
        }        

        public async Task<OperationRequestDto?> AddAsync(CreatingOperationRequestDto requestDto, RequestCode requestCode)
        {
            try
            {
                var operationRequest = OperationRequestMapper.ToEntityFromCreating(requestDto, requestCode);

                await this._repo.AddAsync(operationRequest);
                await this._unitOfWork.CommitAsync();
                
                await _logService.LogAction(
                    EntityType.OperationRequest, 
                    DbLogType.Create,
                    "Created {" + operationRequest.Id.Value + "}"
                    );
                
                return OperationRequestMapper.ToDto(operationRequest);
            }
            catch (Exception e)
            {
                await _logService.LogAction(
                    EntityType.OperationRequest, 
                    DbLogType.Create, 
                    e.ToString()
                    );
                return null;
            }
        }

        public async Task<List<OperationRequestDto>> GetAllAsync()
        {
            try
            {
                var list = await _repo.GetAllAsync();

                if(list == null || list.Count == 0)
                {
                    return [];
                }

                return OperationRequestMapper.ToDtoList(list);

            }
            catch (Exception)
            {
                return [];
            }
        }

        public async Task<OperationRequestDto?> UpdateAsync(UpdatingOperationRequestDto dto)
        {
            var entity = EntityType.OperationRequest;
            var log = DbLogType.Update;
            
            try
            {
                var operationRequest = await _repo.GetByIdAsync(new OperationRequestId(dto.Id));

                var newOperationRequest = OperationRequestMapper.ToEntityFromUpdating(dto, operationRequest);

                if(operationRequest == null){
                    await _logService.LogAction(entity, log, "Unable to update {" + newOperationRequest.Id  + "}");
                    return null;
                }

                operationRequest.Update(newOperationRequest);

                await _repo.UpdateAsync(operationRequest);
                await _unitOfWork.CommitAsync();


                //await _logService.LogAction(entity, log, "Updated {" + operationRequest.Id + "}");
                
                return OperationRequestMapper.ToDto(operationRequest);

            }
            catch (Exception e)
            {
                await _logService.LogAction(entity, log, e.ToString());
                return null;
            }
        }

        public async Task<OperationRequestDto?> DeleteAsync(OperationRequestId id)
        {
            var entity = EntityType.OperationRequest;
            var log = DbLogType.Delete;
            
            try
            {
                var category = await this._repo.GetByIdAsync(id);

                if (category == null){
                    await _logService.LogAction(entity, log, "Unable to delete {" + id + "}");
                    return null;
                }
                
                this._repo.Remove(category);
                await this._unitOfWork.CommitAsync();

                await _logService.LogAction(entity, log, "Deleted {" + id + "}");

                return OperationRequestMapper.ToDto(id);

            }
            catch (Exception e)
            {
                await _logService.LogAction(entity, log, e.ToString());
                return null;
            }
        }

        public async Task<List<OperationRequestDto>> GetFilteredAsync(
            string? searchId, 
            string? searchLicenseNumber, 
            string? searchPatientName, 
            string? searchOperationType, 
            string? searchDeadlineDate, 
            string? searchPriority, 
            string? searchRequestStatus
        )
        {
            try{
                List<OperationRequestDto?>? requestQuery = (await GetAllAsync())!;

                List<OperationTypeDto> operationType = [];

                List<StaffDto> staff = [];

                List<PatientDto> patient = [];

                if(!string.IsNullOrEmpty(searchId))
                {
                    var id = new OperationRequestId(searchId);
                    
                    var request = await _repo.GetByIdAsync(id);

                    requestQuery = requestQuery
                        .Where(r => r!.Id.ToString() == request.Id.Value)
                        .ToList();
                }

                if(!string.IsNullOrEmpty(searchLicenseNumber)){
                    var staffMember = await _staffService.GetByLicenseNumber(searchLicenseNumber);

                    if(staffMember == null) return [];
                    
                    requestQuery = requestQuery
                        .Where(r => r != null && r.Staff.Value == staffMember.LicenseNumber)
                        .ToList();
                }

                if (!string.IsNullOrEmpty(searchPatientName))
                {
                    var names = searchPatientName.Split('-');
                
                    if(names.Length != 2)
                    {
                        return null;
                    }
                
                    var firstName = names[0].Trim();
                    var lastName = names[1].Trim();
                
                    var fullName = new FullName(new Name(firstName), new Name(lastName));
                
                    var patients = await _patientService.GetByNameAsync(fullName);
                    if(patients == null || patients.Count == 0) return [];
                    
                    var patientsMedicalRecordNumbers = patients.Select(p => p.MedicalRecordNumber.Value).ToList();
                    if(patientsMedicalRecordNumbers == null || patientsMedicalRecordNumbers.Count == 0) return [];
                    
                    requestQuery = requestQuery
                        .Where(r => r != null && patientsMedicalRecordNumbers.Contains(r.Patient.Value))
                        .ToList();
                }
                
                if (!string.IsNullOrEmpty(searchLicenseNumber))
                {
                    var staffMember = await _staffService.GetByLicenseNumber(searchLicenseNumber);

                    if (staffMember == null) return new List<OperationRequestDto>(); // Adjust the return type accordingly

                    requestQuery = requestQuery
                        .Where(r => r != null && r.Staff.Value == staffMember.LicenseNumber)
                        .ToList();
                }


                if(!string.IsNullOrEmpty(searchOperationType)){
                    var operationTypeName = await _operationTypeService.GetByNameAsync(searchOperationType);

                    requestQuery = requestQuery
                        .Where(r => r != null && r.OperationType.Value == operationTypeName.Name)
                        .ToList();
                }

                if(!string.IsNullOrEmpty(searchDeadlineDate)){
                    var date = new DeadlineDate(searchDeadlineDate);

                    requestQuery = requestQuery
                        .Where(r => r != null && r.DeadlineDate.Date == date.Date)
                        .ToList();
                }

                if(!string.IsNullOrEmpty(searchPriority)){
                    var priority = PriorityUtils.FromString(searchPriority);

                    requestQuery = requestQuery
                        .Where(r => r != null && r.Priority.Equals(priority))
                        .ToList();
                }
                
                if(!string.IsNullOrEmpty(searchRequestStatus)){
                    var status = RequestStatusUtils.FromString(searchRequestStatus);

                    requestQuery = requestQuery
                        .Where(r => r != null && r.Status.Equals(status))
                        .ToList();
                }

                if(requestQuery == null || requestQuery.Count == 0) return [];
                
                return requestQuery;
            
            }
            catch(Exception)
            {
                return null;
            }
        }

        public async Task<OperationRequestDto?> GetByCodeAsync(RequestCode code)
        {
            try
            {
                var request = await _repo.GetByCode(code);

                if(request == null) return null;

                return OperationRequestMapper.ToDto(request);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<RequestCode> AssignCodeAsync()
        {
            var requests = await _repo.GetAllAsync();

            if(requests == null || requests.Count == 0)
                return new RequestCode("req1");

            int count = requests.Count + 1;
            return new RequestCode("req" + count);
        }
    }
}
