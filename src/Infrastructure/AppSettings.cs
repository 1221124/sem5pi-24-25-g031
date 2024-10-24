using Microsoft.Extensions.Configuration;

namespace Infrastructure
{
    public static class AppSettings
    {
        public static string EmailDomain { get; private set; }
        public static string ConnectionString { get; private set; }
        public static string Email { get; private set; }
        public static string Password { get; private set; }

        public static void Initialize(IConfiguration configuration)
        {
            EmailDomain = configuration["EmailSettings:EmailDomain"];
            ConnectionString = configuration.GetConnectionString("DefaultConnection");
            Email = configuration["SendEmailSettings:Email"];
            Password = configuration["SendEmailSettings:Password"];
        }
    }
}
