using System.Threading.Tasks;
using Domain.Shared;

namespace Domain.Staffs
{
    public interface IStaffRepository : IRepository<Staff, StaffId>
    {
        Task<Staff> GetByEmailAsync(Email email);
        Task<Staff> GetByPhoneNumberAsync(PhoneNumber phoneNumber);
        Task<List<Staff>> GetByFullNameAsync(Name firstName, Name lastName);
        Task<List<Staff>> GetBySpecializationAsync(Specialization specialization);
    }
}