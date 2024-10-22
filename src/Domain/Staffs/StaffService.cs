using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.DBLogs;
using Domain.Shared;
using Domain.Users;


namespace Domain.Staffs
{
    public class StaffService
    {
        private readonly IUnitOfWork _unitOfWork;

        private readonly IStaffRepository _repo;

        private readonly IUserRepository _userRepo;

        private readonly IDBLogRepository _logRepo;

        public StaffService(IUnitOfWork unitOfWork, IStaffRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<StaffDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();

            List<StaffDto> listDto = list.ConvertAll<StaffDto>(staff => new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, LicenseNumber = staff.LicenseNumber, Specialization = staff.Specialization, Status = staff.Status, SlotAppointement = staff.SlotAppointement, SlotAvailability = staff.SlotAvailability });

            return listDto;
        }

        public async Task<StaffDto> GetByIdAsync(StaffId id)
        {
            var staff = await this._repo.GetByIdAsync(id);

            if (staff == null)
                return null;

            return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, LicenseNumber = staff.LicenseNumber, Specialization = staff.Specialization, Status = staff.Status, SlotAppointement = staff.SlotAppointement, SlotAvailability = staff.SlotAvailability };
        }

        public async Task<StaffDto> GetByEmailAsync(Email email)
        {
            var staff = await this._repo.GetByEmailAsync(email);

            if (staff == null)
                return null;

            return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, LicenseNumber = staff.LicenseNumber, Specialization = staff.Specialization, Status = staff.Status, SlotAppointement = staff.SlotAppointement, SlotAvailability = staff.SlotAvailability };
        }

        //CREATE STAFF WITH first name, last name, contact information, and specialization
        public async Task<StaffDto> AddAsync(CreatingStaffDto dto)
        {

            var user = await _userRepo.GetByIdAsync(dto.UserId);

            if (user == null)
                throw new BusinessRuleValidationException("User not found.");

            string Role = RoleUtils.IdStaff(user.Role);

            var log = await _logRepo.GetByIdAsync(dto.UserId);

            var numberStaff = _repo.GetAllAsync().Result.Count;

            string idStaff = Role + log + numberStaff;

            if (await _repo.GetByEmailAsync(dto.ContactInformation.Email) != null && await _repo.GetByPhoneNumberAsync(dto.ContactInformation.PhoneNumber) != null)
            {
                throw new BusinessRuleValidationException("Email or phone number already in use.");
            }

            var staff = new Staff(new FullName(dto.FullName.FirstName, dto.FullName.LastName), dto.ContactInformation, dto.LicenseNumber, dto.Specialization, Status.Active, new List<Slot>());

            await this._repo.AddAsync(staff);

            await this._unitOfWork.CommitAsync();

            return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, LicenseNumber = staff.LicenseNumber, Specialization = staff.Specialization, Status = staff.Status, SlotAppointement = staff.SlotAppointement, SlotAvailability = staff.SlotAvailability };
        }

        public async Task<StaffDto> UpdateAsync(StaffDto dto)
        {
            var staff = await this._repo.GetByIdAsync(new StaffId(dto.Id));

            if (staff == null)
                return null;

            // change all field
            staff.ChangeContactInformation(dto.ContactInformation);
            staff.ChangeSlotAvailability(dto.SlotAvailability);
            staff.ChangeSpecialization(dto.Specialization);

            await this._unitOfWork.CommitAsync();

            return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, LicenseNumber = staff.LicenseNumber, Specialization = staff.Specialization, Status = staff.Status, SlotAppointement = staff.SlotAppointement, SlotAvailability = staff.SlotAvailability };
        }

        public async Task<StaffDto> InactivateAsync(StaffId id)
        {
            var staff = await this._repo.GetByIdAsync(id);

            if (staff == null)
                return null;

            // change all fields
            staff.MarkAsInative();

            await this._unitOfWork.CommitAsync();

            return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, LicenseNumber = staff.LicenseNumber, Specialization = staff.Specialization, Status = staff.Status, SlotAppointement = staff.SlotAppointement, SlotAvailability = staff.SlotAvailability };
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

            return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, LicenseNumber = staff.LicenseNumber, Specialization = staff.Specialization, Status = staff.Status, SlotAppointement = staff.SlotAppointement, SlotAvailability = staff.SlotAvailability };
        }
    }
}