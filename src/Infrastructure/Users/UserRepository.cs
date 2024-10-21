using Domain.Users;
using Infrastructure.Shared;

namespace Infrastructure.Users
{
    public class UserRepository : BaseRepository<User, UserId>, IUserRepository
    {
        public UserRepository(SARMDbContext context):base(context.Users)
        {

        }
    }
}