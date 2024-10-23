using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Staffs;
using Domain.Shared;
using Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.StaffRepository
{
    public class StaffRepository : BaseRepository<Staff, StaffId>, IStaffRepository
    {
        private DbSet<Staff> _objs;

        public StaffRepository(SARMDbContext context) : base(context.Staffs)
        {
            this._objs = context.Staffs;
        }

        public async Task<Staff> GetByEmailAsync(Email email)
        {
            return await _objs.FirstOrDefaultAsync(x => x.ContactInformation.Email == email);
        }

        public async Task<Staff> GetByPhoneNumberAsync(PhoneNumber phoneNumber)
        {
            return await _objs.FirstOrDefaultAsync(x => x.ContactInformation.PhoneNumber == phoneNumber);
        }

        public Task UpdateAsync(Staff staff)
        {
            throw new System.NotImplementedException();
        }
    }

}

