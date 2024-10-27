using Domain.Shared;
using Domain.Users;
using Infrastructure.UsersSession;

namespace Domain.UsersSession
{
    public class SessionService
    {
        private readonly IUnitOfWork _unitOfWork;

        private readonly IUserSessionRepository _sessions;

        public SessionService(IUnitOfWork unitOfWork, IUserSessionRepository usersSessionRepository)
        {
            _unitOfWork = unitOfWork;
            _sessions = usersSessionRepository;
        }

        public async Task<UserSession> CreateSessionAsync(UserSession session)
        {
            try
            {
            //    _sessions.AddOrUpdate(session.UserId, session, (key, oldValue) => session);

                var userSession = _sessions.GetByUserIdAsync(session.UserId).Result;

                if(userSession != null)
                {
                    userSession.Email = session.Email;
                    userSession.Role = session.Role;
                    userSession.IdToken = session.IdToken;
                    userSession.ExpiresIn = session.ExpiresIn;
                }
                else
                {
                    userSession = await _sessions.AddAsync(session);
                }

                await _unitOfWork.CommitAsync();

                return userSession;
            }
            catch(Exception e)
            {
                throw new Exception("Error creating session: " + e.Message);
            }
        }

        public Task<UserSession?> GetSessionAsync(UserId userId)
        {
            try{
                var session =_sessions.GetByUserIdAsync(userId);
                return session;
            }
            catch(Exception e)
            {
                throw new Exception("Error getting session: " + e.Message);
            }
        }

        public Task<bool> RemoveSessionAsync(UserId userId)
        {
            try
            {
                _sessions.RemoveByUserId(userId);

                _unitOfWork.CommitAsync();

                return Task.FromResult(true);
            }
            catch(Exception e)
            {
                throw new Exception("Error removing session: " + e.Message);
            }
        }

        public Task<UserSession?> GetByIdTokenAsync(string token)
        {
            try
            {
                var session =_sessions.GetByIdTokenAsync(token);
                return session;
            }
            catch(Exception e)
            {
                throw new Exception("Error removing session: " + e.Message);
            }
        }
    }
}