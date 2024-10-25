using Domain.Shared;

namespace Domain.Users{
    public class UserSession
    {
        public Email Email { get; }
        public Role Role { get; }
        public int FailedAttempts { get; private set; }
        public bool IsLocked => FailedAttempts >= 5;
        public UserSession(Email email, Role role)
        {
            Email = email;
            Role = role;
            FailedAttempts = 0;
        }

        public void IncrementFailedAttempts()
        {
            FailedAttempts++;
        }

        public void ResetFailedAttempts()
        {
            FailedAttempts = 0;
        }
        public bool IsRoleAllowedAccess(Role role)
        {
            return Role >= role;
        }
    }   
}