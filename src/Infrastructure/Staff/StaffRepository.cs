using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Staff;
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

        public async Task<List<Staff>> GetByEmailAsync(Email email)
        {
            return await this._objs
                .AsQueryable().Where(x => email.Equals(x.Email)).ToListAsync();
        }
    }

}

