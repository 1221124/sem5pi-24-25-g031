using System.Collections.Concurrent;
using Domain.IAM;
using Domain.Shared;
using Domain.Users;
using Domain.UsersSession;
using Infrastructure.UsersSession;

namespace Domain.UsersSession
{
    public class SessionService
    {
        private readonly IUnitOfWork _unitOfWork;

        private readonly UsersSessionRepository _sessions;

        public SessionService(IUnitOfWork unitOfWork, UsersSessionRepository usersSessionRepository)
        {
            _unitOfWork = unitOfWork;
            _sessions = usersSessionRepository;
        }

        public Task CreateSessionAsync(UserSession session)
        {
            try
            {
               _sessions.AddOrUpdate(session.UserId, session, (key, oldValue) => session);

               _unitOfWork.CommitAsync();

               return Task.CompletedTask;
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
    }
}