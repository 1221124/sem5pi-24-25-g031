using System.Linq;
using System.Threading.Tasks;
using Domain.Shared;
using Domain.Users;
using Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Users
{
    public class UserRepository : BaseRepository<User, UserId>, IUserRepository
    {
        private DbSet<User> _objs;
        public UserRepository(SARMDbContext context):base(context.Users)
        {
            this._objs = context.Users;
        }

        public async Task<User> GetByEmailAsync(Email email)
        {
            return await this._objs
                .AsQueryable().Where(x => email.Value.Equals(x.Email.Value)).FirstOrDefaultAsync();
        }

        public async Task<List<User>> GetAllActiveAsync()
        {
            return await this._objs
                .AsQueryable().Where(x => x.UserStatus == UserStatus.Active).ToListAsync();
        }
    }
}