using Domain.Shared;
using Domain.Users;
using Domain.UsersSession;

namespace Domain.UsersSession{
    public class UserSession : Entity<UserSessionId>, IAggregateRoot
    {
        public UserId UserId { get; set; }
        public Email Email { get; set; }
        public Role Role { get; set; }
        public DateTime ExpiresIn { get; set; }

        public UserSession()
        {
        }
        
        public UserSession(UserId userId, Email email, Role role)
        {
            Id = new UserSessionId(Guid.NewGuid());
            UserId = userId;
            Email = email;
            Role = role;
            ExpiresIn = DateTime.Now.AddMinutes(60);
        }

        public bool IsExpired()
        {
            return DateTime.Now >= ExpiresIn;
        }
    }
}