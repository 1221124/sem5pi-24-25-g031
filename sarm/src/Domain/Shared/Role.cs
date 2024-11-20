

using Infrastructure;

namespace Domain.Shared

{
    public enum Role
    {
        Admin = 0,
        Doctor = 1,
        Nurse = 2,
        Technician = 3,
        Patient = 4
    }

    public class RoleUtils
    {
        public static Role FromString(string role)
        {
            switch (role.ToUpper())
            {
                case "ADMIN":
                    return Role.Admin;
                case "DOCTOR":
                    return Role.Doctor;
                case "NURSE":
                    return Role.Nurse;
                case "TECHNICIAN":
                    return Role.Technician;
                case "PATIENT":
                    return Role.Patient;
                default:
                    throw new System.ArgumentException($"Invalid role: {role}");
            }
        }

        public static string ToString(Role role)
        {
            return role switch
            {
                Role.Admin => "Admin",
                Role.Doctor => "Doctor",
                Role.Nurse => "Nurse",
                Role.Technician => "Technician",
                Role.Patient => "Patient",
                _ => throw new System.ArgumentException($"Invalid role: {role}")
            };
        }

        public static string IdStaff(Role role)
        {
            return role switch
            {
                Role.Doctor => "D",
                Role.Nurse => "N",
                Role.Technician => "T",
                _ => throw new System.Exception("Invalid role")
            };
        }

        public static bool IsValid(string role)
        {
            switch (role.ToUpper())
            {
                case "ADMIN":
                case "DOCTOR":
                case "NURSE":
                case "TECHNICIAN":
                case "PATIENT":
                    return true;
                default:
                    return false;
            }
        }

        public static bool IsValid(Role role)
        {
            return role switch
            {
                Role.Admin => true,
                Role.Doctor => true,
                Role.Nurse => true,
                Role.Technician => true,
                Role.Patient => true,
                _ => false
            };
        }

        public static bool IsStaff(Role role)
        {
            return role == Role.Doctor || role == Role.Nurse || role == Role.Technician;
        }

        public static bool IsBackoffice(Role role)
        {
            return role == Role.Admin || IsStaff(role);
        }

        public static bool IsPatient(Role role)
        {
            return role == Role.Patient;
        }

        public static bool IsDoctor(Role role)
        {
            return role == Role.Doctor;
        }

        public static bool IsNurse(Role role)
        {
            return role == Role.Nurse;
        }

        public static bool IsTechnician(Role role)
        {
            return role == Role.Technician;
        }

        public static bool IsAdmin(Role role)
        {
            return role == Role.Admin;
        }

        public static Role GetRoleFromEmail(string email)
        {
            var emailTrimToLower = email.Trim().ToLower();
            if (emailTrimToLower.Equals(AppSettings.AdminEmail.Trim().ToLower()))
            {
                return Role.Admin;
            } else if (emailTrimToLower.EndsWith(AppSettings.EmailDomain.Trim().ToLower()))
            {
                if (emailTrimToLower.StartsWith("d"))
                {
                    return Role.Doctor;
                } else if (emailTrimToLower.StartsWith("n"))
                {
                    return Role.Nurse;
                } else if (emailTrimToLower.StartsWith("t"))
                {
                    return Role.Technician;
                }
            }
            return Role.Patient;
        }
    }
}