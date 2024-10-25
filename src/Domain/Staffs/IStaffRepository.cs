using System.Threading.Tasks;
using Domain.Shared;

namespace Domain.Staffs
{
    public interface IStaffRepository : IRepository<Staff, StaffId>
    {
        Task<Staff> GetByEmailAsync(Email email);

        Task<Staff> GetByPhoneNumberAsync(PhoneNumber phoneNumber);

        Task<Staff> GetByFullNameAsync(FullName fullName);
    }
}