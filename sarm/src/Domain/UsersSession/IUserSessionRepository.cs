using System.Threading.Tasks;
using Domain.Shared;
using Domain.Users;
using Domain.UsersSession;

namespace Domain.UsersSession
{
    public interface IUserSessionRepository : IRepository<UserSession, UserSessionId>
    {
        void AddOrUpdate(UserId userId, UserSession newSession, Func<object, object, UserSession> updateSession);
        Task<UserSession?> GetByEmailAsync(Email admin);
        Task<UserSession?> GetByIdTokenAsync(string token);
        Task<UserSession?> GetByUserIdAsync(UserId userId);
        void RemoveByUserId(UserId userId);
    }
}