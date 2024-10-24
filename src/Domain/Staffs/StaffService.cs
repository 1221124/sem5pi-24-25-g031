using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.DBLogs;
using Domain.Shared;
using Domain.Users;
using Infrastructure.Staffs;


namespace Domain.Staffs
{
    public class StaffService
    {
        private readonly IUnitOfWork _unitOfWork;

        private readonly IStaffRepository _repo;

        private readonly IUserRepository _userRepo;

        private readonly IDBLogRepository _logRepo;

        private readonly DBLogService _dbLogService;

        private static readonly EntityType StaffEntityType = EntityType.OPERATION_REQUEST;

        public StaffService(IUnitOfWork unitOfWork, IStaffRepository repo, IUserRepository userRepo, IDBLogRepository logRepo, DBLogService dbLogService)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._userRepo = userRepo;
            this._logRepo = logRepo;
            this._dbLogService = dbLogService;
        }

        public StaffService(IUnitOfWork unitOfWork, IStaffRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<StaffDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();

            List<StaffDto> listDto = list.ConvertAll<StaffDto>(staff => new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, Specialization = staff.Specialization, Status = staff.Status, SlotAppointement = staff.SlotAppointement, SlotAvailability = staff.SlotAvailability });

            return listDto;
        }

        public async Task<StaffDto> GetByIdAsync(StaffId id)
        {
            var staff = await this._repo.GetByIdAsync(id);

            if (staff == null)
                return null;

            return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, Specialization = staff.Specialization, Status = staff.Status, SlotAppointement = staff.SlotAppointement, SlotAvailability = staff.SlotAvailability };
        }

        public async Task<StaffDto> GetByEmailAsync(Email email)
        {
            var staff = await this._repo.GetByEmailAsync(email);

            if (staff == null)
                return null;

            return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, Specialization = staff.Specialization, Status = staff.Status, SlotAppointement = staff.SlotAppointement, SlotAvailability = staff.SlotAvailability };
        }

        //CREATE STAFF WITH first name, last name, contact information, and specialization
        public async Task<StaffDto?> AddAsync(Staff dto)
        {
            try
            {
                /*
                var user = await _userRepo.GetByIdAsync(dto.UserId);

                if (user == null)
                    throw new BusinessRuleValidationException("User not found.");
                */
                
                //string Role = RoleUtils.IdStaff(user.Role);

                var log = DateTime.Now.ToString("yyyy");
                
                var numberStaff =  _repo.GetAllAsync().Result.Count;

                if (await _repo.GetByEmailAsync(dto.ContactInformation.Email) != null && await _repo.GetByPhoneNumberAsync(dto.ContactInformation.PhoneNumber) != null)
                {
                    throw new BusinessRuleValidationException("Email or phone number already in use.");
                }

                var staff = new Staff(new LicenseNumber(Role.NotApplicable + log + numberStaff), dto.FullName, dto.ContactInformation, dto.Specialization, Status.Active);


                if (staff == null)
                    return null;

                await this._repo.AddAsync(staff);

                await this._unitOfWork.CommitAsync();

                //_dbLogService.LogAction(EntityType.STAFF, DBLogType.CREATE, staff.Id);

                return StaffMapper.ToDto(staff);
            }
            catch (Exception e)
            {
                //_dbLogService.LogError(EntityType.STAFF, e.ToString());
                return StaffMapper.ToDto(dto);
            }
        }

        public async Task<StaffDto> UpdateAsync(Staff staff)
        {
            try
            {
                Staff newStaff = await _repo.GetByIdAsync(staff.Id);

                if (newStaff == null)
                {
                    _dbLogService.LogError(StaffEntityType, "Unable to find {staff " + staff.Id + "}");
                    return StaffMapper.ToDto(staff);
                }

                // change all field
                newStaff.ChangeContactInformation(staff.ContactInformation);
                newStaff.ChangeSlotAvailability(staff.SlotAvailability);
                newStaff.ChangeSpecialization(staff.Specialization);

                await _repo.UpdateAsync(newStaff);
                await _unitOfWork.CommitAsync();

                _dbLogService.LogAction(StaffEntityType, DBLogType.UPDATE, newStaff.Id);
                return StaffMapper.ToDto(newStaff);
            }
            catch (Exception e)
            {
                _dbLogService.LogError(StaffEntityType, e.ToString());
                return StaffMapper.ToDto(staff);
            }
        }

        public async Task<StaffDto> InactivateAsync(StaffId id)
        {
            var staff = await this._repo.GetByIdAsync(id);

            if (staff == null)
                return null;

            // change all fields
            staff.MarkAsInative();

            await this._unitOfWork.CommitAsync();

            return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, Specialization = staff.Specialization, Status = staff.Status, SlotAppointement = staff.SlotAppointement, SlotAvailability = staff.SlotAvailability };
        }

        public async Task<StaffDto> DeleteAsync(StaffId id)
        {
            var staff = await this._repo.GetByIdAsync(id);

            if (staff == null)
                return null;

            if (staff.Status.IsActive())
                throw new BusinessRuleValidationException("It is not possible to delete an active category.");

            this._repo.Remove(staff);

            await this._unitOfWork.CommitAsync();

            return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, Specialization = staff.Specialization, Status = staff.Status, SlotAppointement = staff.SlotAppointement, SlotAvailability = staff.SlotAvailability };
        }
    }
}