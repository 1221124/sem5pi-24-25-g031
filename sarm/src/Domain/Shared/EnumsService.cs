using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.DbLogs;
using Domain.Patients;
using Domain.Staffs;
using Domain.Users;

namespace Domain.Shared
{
    public class EnumsService {

        public List<string> GetRoles()
        {
            return Enum.GetValues(typeof(Role)).Cast<Role>().Select(r => RoleUtils.ToString(r)).ToList();
        }

        public List<string> GetStatuses()
        {
            return Enum.GetValues(typeof(Status)).Cast<Status>().Select(s => StatusUtils.ToString(s)).ToList();
        }

        public List<string> GetRequestStatuses()
        {
            return Enum.GetValues(typeof(RequestStatus)).Cast<RequestStatus>().Select(r => RequestStatusUtils.ToString(r)).ToList();
        }

        public List<string> GetRPriorities()
        {
            return Enum.GetValues(typeof(Priority)).Cast<Priority>().Select(p => p.ToString()).ToList();
        }

        public List<string> GetGenders()
        {
            List<string?> list = Enum.GetValues(typeof(Gender)).Cast<Gender>().Select(g => GenderUtils.ToString(g)).ToList();
            return list.Select(g => g!).ToList();
        }

        public List<string> GetSpecializations()
        {
            return Enum.GetValues(typeof(Specialization)).Cast<Specialization>().Select(s => SpecializationUtils.ToString(s)).ToList();
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
            return Enum.GetValues(typeof(StaffRole)).Cast<StaffRole>().Select(r => StaffRoleUtils.ToString(r)).ToList();
        }

        public List<string> GetUserStatuses()
        {
            return Enum.GetValues(typeof(UserStatus)).Cast<UserStatus>().Select(u => UserStatusUtils.ToString(u)).ToList();
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
        
        public List<string> GetSurgeryRooms()
        {
            return Enum.GetValues(typeof(SurgeryRoomNumber)).Cast<SurgeryRoomNumber>().Select(r => SurgeryRoomNumberUtils.ToString(r)).ToList();
        }

    }
}