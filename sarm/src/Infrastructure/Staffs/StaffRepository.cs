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
        
        public async Task<List<Staff>> GetAsync(string? name, string? email, string? specialization)
        {
            var staffs = await this._objs.AsQueryable().ToListAsync();

            if (name != null)
            {
                staffs = staffs
                    .Where(x => name.Equals(new FullName(x.FullName.FirstName, x.FullName.LastName).ToString()))
                    .ToList();
            }

            if (specialization != null)
            {
                staffs = staffs
                    .Where(x => specialization.Equals(SpecializationUtils.ToString(x.Specialization)))
                    .ToList();
            }

            if (email != null)
            {
                staffs = staffs
                    .Where(x => email.Equals(x.ContactInformation.Email.Value))
                    .ToList();
            }

            return staffs;
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
        
        public async Task<List<Staff>> GetBySpecializationAsync(Specialization specialization)
        {
            return (await _objs
                .AsQueryable().Where(x => specialization.Equals(x.Specialization)).ToListAsync())!;
        }

        public async Task<Staff> GetByLicenseNumber(LicenseNumber licenseNumber)
        {
            return await _objs.FirstOrDefaultAsync(x => licenseNumber.Equals(x.LicenseNumber));
        }

        public async Task<List<Staff>> GetByRoleAsync(StaffRole staffRole)
        {
            return await this._objs
                .AsQueryable().Where(x => staffRole.Equals(x.StaffRole)).ToListAsync();
        }

        public async Task<List<Staff>> GetActiveWithUserIdNull()
        {
            return await this._objs
                .AsQueryable().Where(x => x.UserId == null && x.Status == Status.Active).ToListAsync();
        }
    }

}

