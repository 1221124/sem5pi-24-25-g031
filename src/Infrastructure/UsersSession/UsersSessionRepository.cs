using System;
using System.Collections.Generic;
using System.Linq;
using Domain.Shared;
using Domain.Users;
using Domain.UsersSession;
using Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.UsersSession
{
    public class UsersSessionRepository : BaseRepository<UserSession, UserSessionId>, IUserSessionRepository
    {
        private DbSet<UserSession> _objs;
        
        public UsersSessionRepository(SARMDbContext context):base(context.UsersSessions)
        {
            this._objs = context.UsersSessions;
        }

        public void AddOrUpdate(UserId userId, UserSession newSession, Func<object, object, UserSession> updateSession)
        {
            var existingSession = _objs.FirstOrDefault(s => s.UserId == userId);

            if (existingSession == null)
            {
                _objs.Add(newSession);
            }
            else
            {
                existingSession = updateSession(existingSession, newSession);
                _objs.Update(existingSession);
            }
        }

        public async Task<UserSession?> GetByEmailAsync(Email admin)
        {
            var session = await _objs.FirstOrDefaultAsync(s => s.Email == admin);

            if (session == null)
            {
                throw new Exception("Session not found");
            }
            else return session;
        }

        public async Task<UserSession?> GetByUserIdAsync(UserId userId)
        {
            return await _objs.FirstOrDefaultAsync(s => s.UserId == userId);
        }

        public void RemoveByUserId(UserId userId)
        {
            var session = _objs.FirstOrDefault(s => s.UserId == userId);
            if (session != null)
            {
                _objs.Remove(session);
            }
        }

        public async Task<UserSession?> GetByIdTokenAsync(string token)
        {
            return await _objs.FirstOrDefaultAsync(s => s.IdToken == token);
        }
    }
}
        