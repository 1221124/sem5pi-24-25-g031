using Microsoft.Extensions.Configuration;

namespace Infrastructure
{
    public static class AppSettings
    {
        public static string EmailDomain { get; private set; }
        public static string ConnectionString { get; private set; }
        public static string Email { get; private set; }
        public static string Password { get; private set; }
        public static string GoogleClientId { get; private set; }
        public static string GoogleClientSecret { get; private set; }
        public static string GoogleURL { get; internal set; }

        public static void Initialize(IConfiguration configuration)
        {
            EmailDomain = configuration["EmailSettings:EmailDomain"];
            ConnectionString = configuration.GetConnectionString("DefaultConnection");
            Email = configuration["SendEmailSettings:Email"];
            Password = configuration["SendEmailSettings:Password"];
            GoogleClientId = configuration["Google:ClientId"];
            GoogleClientSecret = configuration["Google:ClientSecret"];
            GoogleURL = configuration["Google:URL"];
        }
    }
}
