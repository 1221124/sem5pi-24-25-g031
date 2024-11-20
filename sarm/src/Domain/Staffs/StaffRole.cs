using Infrastructure;

namespace Domain.Staffs
{
    public enum StaffRole
    {
        Doctor = 0,
        Nurse = 1,
        Technician = 2
    }

    public class StaffRoleUtils
    {
        public static StaffRole FromString(string role)
        {
            switch (role.ToUpper())
            {
                case "DOCTOR":
                    return StaffRole.Doctor;
                case "NURSE":
                    return StaffRole.Nurse;
                case "TECHNICIAN":
                    return StaffRole.Technician;
                default:
                    throw new System.ArgumentException($"Invalid role: {role}");
            }
        }

        public static string ToString(StaffRole role)
        {
            return role switch
            {
                StaffRole.Doctor => "Doctor",
                StaffRole.Nurse => "Nurse",
                StaffRole.Technician => "Technician",
                _ => throw new System.ArgumentException($"Invalid role: {role}")
            };
        }

        public static string IdStaff(StaffRole role)
        {
            return role switch
            {
                StaffRole.Doctor => "D",
                StaffRole.Nurse => "N",
                StaffRole.Technician => "T",
                _ => throw new System.Exception("Invalid role")
            };
        }

        public static bool IsValid(string role)
        {
            switch (role.ToUpper())
            {
                case "DOCTOR":
                case "NURSE":
                case "TECHNICIAN":
                    return true;
                default:
                    return false;
            }
        }

        public static bool IsValid(StaffRole role)
        {
            return role switch
            {
                StaffRole.Doctor => true,
                StaffRole.Nurse => true,
                StaffRole.Technician => true,
                _ => false
            };
        }

        public static bool IsDoctor(StaffRole role)
        {
            return role == StaffRole.Doctor;
        }

        public static bool IsNurse(StaffRole role)
        {
            return role == StaffRole.Nurse;
        }

        public static bool IsTechnician(StaffRole role)
        {
            return role == StaffRole.Technician;
        }
    }
}