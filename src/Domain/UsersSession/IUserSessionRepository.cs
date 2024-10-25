using System.Threading.Tasks;
using Domain.Shared;
using Domain.UsersSession;

namespace Domain.UsersSession
{
    public interface IUserSessionRepository : IRepository<UserSession, UserSessionId>
    {
    }
}