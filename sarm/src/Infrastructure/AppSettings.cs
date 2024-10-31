using Microsoft.Extensions.Configuration;

namespace Infrastructure
{
    public static class AppSettings
    {
        public static string EmailDomain { get; private set; }
        public static string ConnectionString { get; private set; }
        public static string Email { get; private set; }
        public static string Password { get; private set; }
        public static string IAMDomain { get; private set; }
        public static string IAMAudience { get; private set; }
        public static string IAMClientId { get; private set; }
        public static string IAMClientSecret { get; private set; }
        public static string IAMRedirectUri { get; private set; }
        public static string IAMLoginUrl { get; private set; }
        public static string IAMLogoutUrl { get; private set; }
        public static string VerifyEmailUrl { get; private set; }
        public static string AdminEmail { get; private set; }

        public static void Initialize(IConfiguration configuration)
        {
            EmailDomain = configuration["SendEmailSettings:Email"];
            ConnectionString = configuration.GetConnectionString("DefaultConnection");
            Email = configuration["SendEmailSettings:Email"];
            Password = configuration["SendEmailSettings:Password"];
            IAMDomain = configuration["IAM:Domain"];
            IAMClientId = configuration["IAM:ClientId"];
            IAMAudience = configuration["IAM:Audience"];
            IAMClientSecret = configuration["IAM:ClientSecret"];
            IAMRedirectUri = configuration["IAM:redirect_uri"];
            IAMLoginUrl = configuration["IAM:LoginURL"];
            IAMLogoutUrl = configuration["IAM:LogoutURL"];
            VerifyEmailUrl = configuration["VerifyEmailUrl"];
            AdminEmail = configuration["AdminEmail"];
        }
    }
}
