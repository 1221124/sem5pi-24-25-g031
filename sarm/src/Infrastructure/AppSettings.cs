namespace Infrastructure
{
    public static class AppSettings
    {
        public static string EmailDomain { get; private set; }
        public static string ConnectionString { get; private set; }
        public static string SmtpServer { get; private set; }
        public static string SmtpPort { get; private set; }
        public static string FromEmail { get; private set; }
        public static string Password { get; private set; }
        public static string IAMDomain { get; private set; }
        public static string IAMAudience { get; private set; }
        public static string IAMClientId { get; private set; }
        public static string IAMClientSecret { get; private set; }
        public static string IAMRedirectUri { get; private set; }
        public static string IAMLoginUrl { get; private set; }
        public static string IAMLogoutUrl { get; private set; }
        public static string VerifyEmailUrl { get; private set; }
        public static string SensitiveInfoStaffUrl { get; private set; }
        public static string SensitiveInfoPatientUrl { get; private set; }
        public static string RemoveSensitiveInfoPatientUrl { get; private set; }
        public static string AdminEmail { get; private set; }
        public static string Doctor1Email { get; private set; }
        public static string Doctor2Email { get; private set; }
        public static string NurseEmail { get; private set; }
        public static string TechnicianEmail { get; private set; }
        public static string RoleAdmin { get; private set; }
        public static string RoleDoctor { get; private set; }
        public static string RoleNurse { get; private set; }
        public static string RoleTechnician { get; private set; }
        public static string RolePatient { get; private set; }
        public static string MaxOperations { get; private set; }
        public static string PrologPathLAPR5 { get; private set; }
        public static string PrologFileScheduling { get; private set; }
        public static string PrologFileFirstHeuristic { get; private set; }
        public static void Initialize(IConfiguration configuration)
        {
            EmailDomain = configuration["EmailSettings:EmailDomain"];
            ConnectionString = configuration.GetConnectionString("DefaultConnection");
            SmtpServer = configuration["SendEmailSettings:SmtpServer"];
            SmtpPort = configuration["SendEmailSettings:Port"];
            FromEmail = configuration["SendEmailSettings:FromEmail"];
            Password = configuration["SendEmailSettings:Password"];
            IAMDomain = configuration["IAM:Domain"];
            IAMClientId = configuration["IAM:ClientId"];
            IAMAudience = configuration["IAM:Audience"];
            IAMClientSecret = configuration["IAM:ClientSecret"];
            IAMRedirectUri = configuration["IAM:redirect_uri"];
            IAMLoginUrl = configuration["IAM:LoginURL"];
            IAMLogoutUrl = configuration["IAM:LogoutURL"];
            VerifyEmailUrl = configuration["VerifyEmailUrl"];
            SensitiveInfoStaffUrl = configuration["SensitiveInfoStaffUrl"];
            SensitiveInfoPatientUrl = configuration["SensitiveInfoPatientUrl"];
            RemoveSensitiveInfoPatientUrl = configuration["RemoveSensitiveInfoPatientUrl"];
            AdminEmail = configuration["Email:Admin"];
            Doctor1Email = configuration["Email:Doctor1"];
            Doctor2Email = configuration["Email:Doctor2"];
            NurseEmail = configuration["Email:Nurse"];
            TechnicianEmail = configuration["Email:Technician"];
            RoleAdmin = configuration["RoleId:Admin"];
            RoleDoctor = configuration["RoleId:Doctor"];
            RoleNurse = configuration["RoleId:Nurse"];
            RoleTechnician = configuration["RoleId:Technician"];
            RolePatient = configuration["RoleId:Patient"];
            MaxOperations = configuration["MaxOperations"];
            PrologPathLAPR5 = configuration["Prolog:PathToPrologLAPR5"];
            PrologFileScheduling = configuration["Prolog:FileScheduling"];
            PrologFileFirstHeuristic = configuration["Prolog:FileFirstHeuristic"];
        }
    }
}