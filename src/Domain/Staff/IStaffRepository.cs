using System.Threading.Tasks;
using Domain.Shared;

namespace Domain.Staff
{
    public interface IStaffRepository : IRepository<Staff, StaffId>
    {
        //Task<Staff> GetByEmailAsync(Email email);
    }
}