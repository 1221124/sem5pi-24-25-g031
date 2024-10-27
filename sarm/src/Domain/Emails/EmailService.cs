
using Domain.Shared;
using System.Security.Cryptography;
using System.Web;
using DDDNetCore.Domain.Patients;
using Infrastructure;
using RestSharp;
using System.Text;

namespace Domain.Emails
{
    public class EmailService: IEmailService
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
                sender = new { name = "SARM G031", email = _fromEmail },
                to = new[] { new { email = toEmail, name = toEmail } },
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
        
        public async Task<(string subject, string body)> GenerateVerificationEmailContentSensitiveInfo(string token, UpdatingPatientDto dto)
        {
            var subject = "Please verify that you want to change sensitive information";
            var link = GenerateLinkSensitiveInfo(dto.EmailId.Value, token, dto.PendingPhoneNumber, dto.PendingEmail);
            var body = $"Hi, {dto.EmailId.Value}!\n\nYou have requested to change sensitive information. Click on the link below to change it: {link}.\n\nSARM G031";

            return (subject ,body);
        }

        public string GenerateLink(string email)
        {
            return $"http://localhost:5500/api/Users/verify?token={EncodeToken(email)}";
        }
        
        public string GenerateLinkSensitiveInfo(string email, string token, PhoneNumber? phoneNumber, Email? newEmail)
        {
            var uriBuilder = new UriBuilder($"http://localhost:5500/api/Patient/sensitiveInfo");
            var query = HttpUtility.ParseQueryString(uriBuilder.Query);

            query["email"] = email;
            query["token"] = token;
            
            if (phoneNumber != null)
            {
                query["pendingPhoneNumber"] = phoneNumber.Value.ToString();
            }
            if(newEmail != null)
            {
                query["pendingEmail"] = newEmail.Value;
            }
            
            uriBuilder.Query = query.ToString();
            return uriBuilder.ToString();
        }

        public string GenerateToken()
        {
            using (var hmac = new HMACSHA256())
            {
                var token = Convert.ToBase64String(hmac.Key);
                return token;
            }
        }

        public string EncodeToken(string email)
        {
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(email));
        }
    
        public string DecodeToken(string token)
        {
            return Encoding.UTF8.GetString(Convert.FromBase64String(token));
        }
    }

}

