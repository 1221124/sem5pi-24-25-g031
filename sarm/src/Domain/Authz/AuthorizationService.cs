using Domain.Shared;
using Domain.UsersSession;

namespace Domain.Authz
{
    public class AuthorizationService(IUserSessionRepository sessionRepo)
    {
        private readonly IUserSessionRepository _sessionRepo = sessionRepo;

        public async Task<Authorization> AdminAuthorizationAsync(Email admin)
        {
            try{
                var session = await _sessionRepo.GetByEmailAsync(admin);

                if(session == null)
                {
                    return new();
                }
                else if(RoleUtils.IsAdmin(session.Role) && !session.IsExpired())
                {
                    return new(session.Id.AsGuid());
                }
                else return new();

            }catch(Exception){
                return new();
            }
        }

        public async Task<Authorization> BackofficeUserAuthorizationAsync(Email backofficeUser)
        {
            try{
                var session = await _sessionRepo.GetByEmailAsync(backofficeUser);

                if(session == null)
                {
                    return new();
                }
                else if((RoleUtils.IsStaff(session.Role) || RoleUtils.IsAdmin(session.Role)) && !session.IsExpired())
                {
                    return new(session.Id.AsGuid());
                }
                else return new();

            }
            catch(Exception)
            {
                return new();
            }
        }

        public async Task<Authorization> PatientAuthorizationAsync(Email patient)
        {
            try{
                var session = await _sessionRepo.GetByEmailAsync(patient);

                if(session == null)
                {
                    return new();
                }
                else if(RoleUtils.IsPatient(session.Role) && !session.IsExpired())
                {
                    return new(session.Id.AsGuid());
                }
                else return new();

            }
            catch(Exception)
            {
                return new();
            }
        }

        public async Task<Authorization> DoctorAuthorizationAsync(Email doctor)
        {
            try{
                var session = await _sessionRepo.GetByEmailAsync(doctor);

                if(session == null)
                {
                    return new();
                }
                else if(RoleUtils.IsDoctor(session.Role) && !session.IsExpired())
                {
                    return new(session.Id.AsGuid());
                }
                else return new();

            }
            catch(Exception)
            {
                return new();
            }   
        }
    }
}