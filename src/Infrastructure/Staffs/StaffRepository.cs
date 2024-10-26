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
            return await this._objs
                .AsQueryable().Where(x => email.Equals(x.ContactInformation.Email)).FirstOrDefaultAsync();
        }

        public async Task<Staff> GetByPhoneNumberAsync(PhoneNumber phoneNumber)
        {
            return await _objs.FirstOrDefaultAsync(x => x.ContactInformation.PhoneNumber == phoneNumber);
        }

        public async Task<List<Staff>> GetByFullNameAsync(Name firstName, Name lastName)
        {
            return (await _objs
                .AsQueryable().Where(x=> firstName.Equals(x.FullName.FirstName)).Where(x=> lastName.Equals(x.FullName.LastName)).ToListAsync())!;
        }
    }

}

