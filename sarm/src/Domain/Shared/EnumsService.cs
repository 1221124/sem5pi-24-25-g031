using Domain.DbLogs;
using Domain.OperationRequests;
using Domain.OperationTypes;
using Domain.Patients;
using Domain.Users;

namespace Domain.Shared
{
    public class EnumsService {

        public List<string> GetRoles()
        {
            return Enum.GetValues(typeof(Role)).Cast<Role>().Select(r => r.ToString()).ToList();
        }

        public List<string> GetStatuses()
        {
            return Enum.GetValues(typeof(Status)).Cast<Status>().Select(s => s.ToString()).ToList();
        }

        public List<string> GetRequestStatuses()
        {
            return Enum.GetValues(typeof(RequestStatus)).Cast<RequestStatus>().Select(r => r.ToString()).ToList();
        }

        public List<string> GetRPriorities()
        {
            return Enum.GetValues(typeof(Priority)).Cast<Priority>().Select(p => p.ToString()).ToList();
        }

        public List<string> GetGenders()
        {
            return Enum.GetValues(typeof(Gender)).Cast<Gender>().Select(g => g.ToString()).ToList();
        }

        public List<string> GetSpecializations()
        {
            return Enum.GetValues(typeof(Specialization)).Cast<Specialization>().Select(s => s.ToString()).ToList();
        }

        public List<string> GetPhases()
        {
            return Enum.GetValues(typeof(Phase)).Cast<Phase>().Select(p => p.ToString()).ToList();
        }

        public List<string> GetBackofficeRoles()
        {
            var roles = Enum.GetValues(typeof(Role)).Cast<Role>().Select(r => r.ToString()).ToList();
            for (int i = 0; i < roles.Count; i++)
            {
                if (!RoleUtils.IsBackoffice(RoleUtils.FromString(roles[i])))
                {
                    roles.RemoveAt(i);
                    i--;
                }
            }
            return roles;
        }

        public List<string> GetStaffRoles() {
            var roles = Enum.GetValues(typeof(Role)).Cast<Role>().Select(r => r.ToString()).ToList();
            for (int i = 0; i < roles.Count; i++)
            {
                if (!RoleUtils.IsStaff(RoleUtils.FromString(roles[i])))
                {
                    roles.RemoveAt(i);
                    i--;
                }
            }
            return roles;
        }

        public List<string> GetUserStatuses()
        {
            return Enum.GetValues(typeof(UserStatus)).Cast<UserStatus>().Select(u => u.ToString()).ToList();
        }

        public List<string> GetDBLogTypes()
        {
            return Enum.GetValues(typeof(DbLogType)).Cast<DbLogType>().Select(l => l.ToString()).ToList();
        }

        public List<string> GetEntityTypes()
        {
            return Enum.GetValues(typeof(EntityType)).Cast<EntityType>().Select(e => e.ToString()).ToList();
        }

        public List<string> GetUpdateTypes()
        {
            return Enum.GetValues(typeof(UpdateType)).Cast<UpdateType>().Select(u => u.ToString()).ToList();
        }

    }
}