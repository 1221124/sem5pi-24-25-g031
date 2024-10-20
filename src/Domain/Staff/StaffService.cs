using Domain.Staff;

namespace Staff.Domain
{
    public class StaffService
    {
        private readonly IUnitOfWork _unitOfWork;

        private readonly IStaffRepository _repo;

        public StaffService(IUnitOfWork unitOfWork, IStaffRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<StaffDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();

            List<StaffDto> listDto = list.ConvertAll<StaffDto>(staff => new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, LicenseNumber = staff.LicenseNumber, Specialization = staff.Specialization, Status = staff.Status, Slot = staff.Slot });

            return listDto;
        }

        public async Task<StaffDto> GetByIdAsync(StaffId id)
        {
            var staff = await this._repo.GetByIdAsync(id);

            if (staff == null)
                return null;

            return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, LicenseNumber = staff.LicenseNumber, Specialization = staff.Specialization, Status = staff.Status, Slot = staff.Slot };
        }

        public async Task<StaffDto> AddAsync(CreatingStaffDto dto)
        {
            var staff = new Staff(dto.FullName, dto.ContactInformation, dto.LicenseNumber, dto.Specialization, dto.Status, dto.Slot);

            await this._repo.AddAsync(staff);

            await this._unitOfWork.CommitAsync();

            return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, LicenseNumber = staff.LicenseNumber, Specialization = staff.Specialization, Status = staff.Status, Slot = staff.Slot };
        }

        public async Task<StaffDto> UpdateAsync(StaffDto dto)
        {
            var staff = await this._repo.GetByIdAsync(new StaffId(dto.Id));

            if (staff == null)
                return null;

            // change all field
            staff.ChangeFullName(dto.FullName);
            staff.ChangeContactInformation(dto.ContactInformation);
            staff.ChangeLicenseNumber(dto.LicenseNumber);
            staff.ChangeSpecialization(dto.Specialization);
            staff.ChangeStatus(dto.Status);
            staff.ChangeSlot(dto.Slot);

            await this._unitOfWork.CommitAsync();

            return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, LicenseNumber = staff.LicenseNumber, Specialization = staff.Specialization, Status = staff.Status, Slot = staff.Slot };
        }

        public async Task<StaffDto> InactivateAsync(StaffId id)
        {
            var staff = await this._repo.GetByIdAsync(id);

            if (staff == null)
                return null;

            // change all fields
            staff.MarkAsInative();

            await this._unitOfWork.CommitAsync();

            return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, LicenseNumber = staff.LicenseNumber, Specialization = staff.Specialization, Status = staff.Status, Slot = staff.Slot };
        }

        public async Task<StaffDto> DeleteAsync(StaffId id)
        {
            var staff = await this._repo.GetByIdAsync(id);

            if (staff == null)
                return null;

            await this._repo.DeleteAsync(staff);

            await this._unitOfWork.CommitAsync();

            return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, LicenseNumber = staff.LicenseNumber, Specialization = staff.Specialization, Status = staff.Status, Slot = staff.Slot };
        }
    }
}