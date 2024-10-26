
using Domain.Shared;
using System.Security.Cryptography;
using Infrastructure;
using RestSharp;

namespace Domain.Emails
{
    public class EmailService
    {
        private readonly string _fromEmail;
        private readonly string _apiKey;

        public EmailService(string fromEmail, string apiKey)
        {
            _fromEmail = fromEmail;
            _apiKey = apiKey;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var client = new RestClient("https://api.sendinblue.com/v3/smtp/email");
            var request = new RestRequest("", Method.Post);
            request.AddHeader("api-key", _apiKey);
            request.AddJsonBody(new
            {
                sender = new { email = _fromEmail },
                to = new[] { new { email = toEmail } },
                subject = subject,
                htmlContent = body
            });

            var response = await client.ExecuteAsync<dynamic>(request);

            if (!response.IsSuccessful)
            {
                throw new Exception($"Error sending email: {response.Content}");
            }
        }

        public async Task<(string subject, string body)> GenerateVerificationEmailContent(Email email)
        {
            var subject = "Please verify your registration in our system";
            var link = GenerateLink(email.Value);
            var body = $"Hi, {email.Value}!\n\nYou have been successfully registered! Click on the link below to verify your email and gain access to our system: {link}.\n\nSARM G031";

            return (subject, body);
        }

        public string GenerateLink(string email)
        {
            return $"{AppSettings.VerifyEmailUrl}?email={email}&token={GenerateToken()}";
        }

        public string GenerateToken()
        {
            using (var hmac = new HMACSHA256())
            {
                var token = Convert.ToBase64String(hmac.Key);
                return token;
            }
        }
    }

}

