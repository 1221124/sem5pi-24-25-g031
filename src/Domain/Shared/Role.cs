namespace Domain.Shared

{
    public enum Role
    {
        Admin,
        Doctor,
        Nurse,
        Technician,
        Patient
    }

    public class RoleUtils
    {
        public static Role FromString(string role)
        {
            return role switch
            {
                "Admin" => Role.Admin,
                "Doctor" => Role.Doctor,
                "Nurse" => Role.Nurse,
                "Technician" => Role.Technician,
                "Patient" => Role.Patient,
                _ => throw new System.Exception("Invalid role")
            };
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
                _ => throw new System.Exception("Invalid role")
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
            return role switch
            {
                "Admin" => true,
                "Doctor" => true,
                "Nurse" => true,
                "Technician" => true,
                "Patient" => true,
                _ => false
            };
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
    }
}