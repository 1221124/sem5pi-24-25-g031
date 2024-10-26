using Domain.Shared;
using Domain.Users;

namespace Domain.UsersSession {
    public class UserSession : Entity<UserSessionId>, IAggregateRoot
    {
        public UserId UserId { get; set; }
        public Email Email { get; set; }
        public Role Role { get; set; }
        public DateTime ExpiresIn { get; set; }
        public string IdToken { get; set; }

        public UserSession()
        {
        }
        
        public UserSession(UserId userId, Email email, Role role, string idToken)
        {
            Id = new UserSessionId(Guid.NewGuid());
            UserId = userId;
            Email = email;
            Role = role;
            ExpiresIn = DateTime.Now.AddMinutes(60);
            IdToken = idToken;
        }

        public bool IsExpired()
        {
            return DateTime.Now >= ExpiresIn;
        }
    }
}