using System.Threading.Tasks;
using Domain.Shared;

namespace Domain.Users
{
    public interface IUserRepository: IRepository<User, UserId>
    {
        Task<User> GetByEmailAsync(Email email);
    }
}