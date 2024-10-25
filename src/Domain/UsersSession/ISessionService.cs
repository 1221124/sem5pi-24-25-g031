using Domain.Users;

namespace Domain.UsersSession
{
    public interface ISessionService
    {
        Task<UserSession?> GetSessionAsync(UserId userId);
        Task CreateSessionAsync(UserSession session);
        Task<bool> RemoveSessionAsync(UserId userId);
    }
}