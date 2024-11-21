using System.Threading.Tasks;
using Domain.Shared;

namespace Domain.Staffs
{
    public interface IStaffRepository : IRepository<Staff, StaffId>
    {
        Task<List<Staff>> GetAsync(string? name, string? email, string? specialization);
        Task<Staff> GetByEmailAsync(Email email);
        Task<Staff> GetByPhoneNumberAsync(PhoneNumber phoneNumber);
        Task<List<Staff>> GetByFullNameAsync(Name firstName, Name lastName);
        Task<List<Staff>> GetBySpecializationAsync(Specialization specialization);
        Task<Staff> GetByLicenseNumber(LicenseNumber licenseNumber);
        Task<List<Staff>> GetByRoleAsync(StaffRole staffRole);
        Task<List<Staff>> GetActiveWithUserIdNull();
    }
}