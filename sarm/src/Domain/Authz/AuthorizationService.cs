using Domain.Shared;
using Domain.UsersSession;

namespace Domain.Authz
{
    public class AuthorizationService
    {
        private readonly IUserSessionRepository _sessionRepo;

        public AuthorizationService(IUserSessionRepository sessionRepo)
        {
            _sessionRepo = sessionRepo;
        }

        public bool IsAuthorized(string idToken, string? roles)
        {
            roles = roles.ToUpper();
            var session = _sessionRepo.GetByIdTokenAsync(idToken).Result;

            if (session == null)
            {
                return false;
            }

            if (roles == null)
            {
                return true;
            }

            string[] rolesArray = roles.Split(",");
            foreach (var role in rolesArray)
            {
                if (session.Role == RoleUtils.FromString(role))
                {
                    return true;
                }
            }

            return false;
        }
    }
}