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
            var staffs = await _repo.GetAllAsync();

            List<StaffDto> listDto = list.ConvertAll<StaffDto>(staff => new StaffDto { Id = staff.Id.AsGuid(), Name = staff.Name, Email = staff.Email, Phone = staff.Phone, Role = staff.Role, Active = staff.Active });

            return listDto;
        }

        public async Task<StaffDto> GetByIdAsync(StaffId id)
        {
            var staff = await _repo.GetByIdAsync(id);

            if (staff == null)
                return null;

            return new StaffDto { Id = staff.Id.AsGuid(), Name = staff.Name, Email = staff.Email, Phone = staff.Phone, Role = staff.Role, Active = staff.Active };
        }

        public async Task<StaffDto> AddAsync(CreatingStaffDto dto)
        {
            var staff = new Staff(dto.Name, dto.Email, dto.Phone, dto.Role, dto.Active);

            await _repo.AddAsync(staff);

            await _unitOfWork.CommitAsync();

            return new StaffDto { Id = staff.Id.AsGuid(), Name = staff.Name, Email = staff.Email, Phone = staff.Phone, Role = staff.Role, Active = staff.Active };
        }

        public async Task<StaffDto> UpdateAsync(StaffDto dto)
        {
            var staff = await _repo.GetByIdAsync(new StaffId(dto.Id));

            if (staff == null)
                return null;

            staff.ChangeName(dto.Name);
            staff.ChangeContactInformation(dto.Email, dto.Phone);
            staff.ChangeRole(dto.Role);
            staff.ChangeSpecialization(dto.Specialization);
            staff.ChangeSlot(dto.Slot);
            staff.ChangeActive(dto.Active);

            await _unitOfWork.CommitAsync();

            return new StaffDto { Id = staff.Id.AsGuid(), Name = staff.Name, Email = staff.Email, Phone = staff.Phone, Role = staff.Role, Specialization = staff.Specialization, Slot = staff.Slot, Active = staff.Active };
        }

        public async Task<StaffDto> InactivateAsync(StaffId id)
        {
            var staff = await _repo.GetByIdAsync(id);

            if (staff == null)
                return null;

            staff.Inactivate();

            await _unitOfWork.CommitAsync();

            return new StaffDto { Id = staff.Id.AsGuid(), Name = staff.Name, Email = staff.Email, Phone = staff.Phone, Role = staff.Role, Active = staff.Active };
        }

        public async Task<StaffDto> InactiveAsync(StaffId id)
        {
            var staff = await _repo.GetByIdAsync(id);

            if (staff == null)
                return null;

            staff.Inactive();

            await _unitOfWork.CommitAsync();

            return new StaffDto { Id = staff.Id.AsGuid(), Name = staff.Name, Email = staff.Email, Phone = staff.Phone, Role = staff.Role, Active = staff.Active };
        }

        public async Task<StaffDto> DeleteAsync(StaffId id)
        {
            var staff = await _repo.GetByIdAsync(id);

            if (staff == null)
                return null;

            if (staff.Active)
                return null;

            await _repo.DeleteAsync(staff);

            await _unitOfWork.CommitAsync();

            return new StaffDto { Id = staff.Id.AsGuid(), Name = staff.Name, Email = staff.Email, Phone = staff.Phone, Role = staff.Role, Active = staff.Active };
        }

    }
}