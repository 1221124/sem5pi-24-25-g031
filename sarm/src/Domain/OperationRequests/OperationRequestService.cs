using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.Patients;
using Domain.DbLogs;
using Domain.Shared;
using Domain.OperationTypes;
using Domain.OperationRequests;
using Domain.Staffs;

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

        public async Task<OperationRequestDto?> AddAsync(CreatingOperationRequestDto requestDto)
        {
            try
            {
                var operationRequest = OperationRequestMapper.ToEntityFromCreating(requestDto);

                await this._repo.AddAsync(operationRequest);
                await this._unitOfWork.CommitAsync();
                
                await _logService.LogAction(EntityType.OperationRequest, DbLogType.Create, "Created {" + operationRequest.Id.Value + "}");
                
                return OperationRequestMapper.ToDto(operationRequest);
            }
            catch (Exception e)
            {
                await _logService.LogAction(EntityType.OperationRequest, DbLogType.Create, e.ToString());
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
                var operationRequest = await _repo.GetByIdAsync(dto.Id);

                var newOperationRequest = OperationRequestMapper.ToEntityFromUpdating(dto, operationRequest);

                if(operationRequest == null){
                    await _logService.LogAction(entity, log, "Unable to update {" + newOperationRequest.Id  + "}");
                    return null;
                }

                operationRequest.Update(newOperationRequest);

                await _repo.UpdateAsync(operationRequest);
                await _unitOfWork.CommitAsync();


                await _logService.LogAction(entity, log, "Updated {" + operationRequest.Id + "}");
                
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

        public async Task<List<OperationRequestDto>> GetFilteredAsync(OperationRequestFilters filters)
        {
            try{
                var list = await _repo.GetFilteredAsync(filters);

                if(filters.SearchLicenseNumber != new LicenseNumber()){
                    var staff = await _staffService.GetByLicenseNumber(filters.SearchLicenseNumber);

                    list = list.Where(l => l.Staff.Equals(filters.SearchLicenseNumber)).ToList();
                }

                if(filters.SearchPatientName != new Name("")){
                    var patients = await _patientService.GetByNameAsync(filters.SearchPatientName);

                    list = list.Where(l => patients.Any(p => l.Patient.Equals(p.MedicalRecordNumber))).ToList();
                }

                if(list == null)
                    return [];

                return OperationRequestMapper.ToDtoList(list);
            }catch(Exception){
                return [];
            }
        }
    //         try
    //         {
    //             // Fetch all requests
    //             var list = await _repo.GetAllAsync();

    //             // Apply filters conditionally
    //             var filteredList = new List<OperationRequest>();

    //             if (filters.SearchId != Guid.Empty)
    //             {
    //                 filteredList = list.Where(x => x.Id == filters.SearchId).ToList();
    //                 list = filteredList;
    //             }

    //             if (filters.SearchPatientName != new Name(""))
    //             {
    //                 var patients = await _patientService.GetAllAsync();

    //                 var patient = patients.FirstOrDefault(x => x.FullName == filters.SearchPatientName);

    //                 if (patient != null)
    //                 {
    //                     filteredList = list.Where(x => x.Patient == patient.MedicalRecordNumber).ToList();
    //                     list = filteredList;
    //                 }
    //             }

    //             if (filters.SearchOperationType != new Name(""))
    //             {
    //                 var operationTypes = await _operationTypeService.GetAllAsync();

    //                 var operationType = operationTypes.FirstOrDefault(x => x.Name == filters.SearchOperationType);

    //                 if (operationType != null)
    //                 {
    //                     filteredList = list.Where(x => x.OperationType == operationType.Name).ToList();
    //                     list = filteredList;
    //                 }
    //             }

    //             if (filters.SearchDeadlineDate != new DeadlineDate())
    //             {
    //                 filteredList = list.Where(x => x.DeadlineDate == filters.SearchDeadlineDate).ToList();
    //                 list = filteredList;
    //             }

    //             if (filters.SearchPriority.ToString() != "")
    //             {
    //                 filteredList = list.Where(x => x.Priority == filters.SearchPriority).ToList();
    //                 list = filteredList;
    //             }

    //             if (filters.SearchRequestStatus.ToString() != "")
    //             {
    //                 filteredList = list.Where(x => x.Status == filters.SearchRequestStatus).ToList();
    //                 list = filteredList;
    //             }

    //             // Map to DTOs and return
    //             return OperationRequestMapper.ToDtoList(filteredList);
    //         }
    //         catch (Exception)
    //         {
    //             return [];
    //         }
    //     }
    // }
    }
}
