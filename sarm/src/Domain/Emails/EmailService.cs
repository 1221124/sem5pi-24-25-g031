using Domain.Shared;
using System.Security.Cryptography;
using System.Web;
using DDDNetCore.Domain.Patients;
using Infrastructure;
using System.Text;
using Domain.Staffs;
using System.Net.Mail;
using System.Net;

namespace Domain.Emails
{
    public class EmailService : IEmailService
    {

        public EmailService()
        {
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            using (var smtpClient = new SmtpClient(AppSettings.SmtpServer, int.Parse(AppSettings.SmtpPort)))
            {
                smtpClient.Credentials = new NetworkCredential(AppSettings.FromEmail, AppSettings.Password);
                smtpClient.EnableSsl = true;

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(AppSettings.FromEmail, "SARM G031"),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(toEmail);

                await smtpClient.SendMailAsync(mailMessage);
            }
        }

        public async Task<(string subject, string body)> GenerateVerificationEmailContent(Email email)
        {
            var subject = "Please verify your registration in our system";
            var link = GenerateLink(email.Value);
            var body = $"Hi, {email.Value}!\n\nYou have been successfully registered! Click on the link below to verify your email and gain access to our system: {link}.\n\nSARM G031";

            return (subject, body);
        }
        
        public async Task<(string subject, string body)> GenerateVerificationEmailContentSensitiveInfo(UpdatingPatientDto dto)
        {
            const string subject = "Please verify that you want to change sensitive information";
            const string baseUrl = "Patient";
            
            var email = dto.PendingEmail ?? dto.Email; // if pending email is null, use the current email
            var phoneNumber = dto.PendingPhoneNumber ?? dto.PhoneNumber; // if pending phone number is null, use the current phone number
            var link = GenerateLinkSensitiveInfo(baseUrl, dto.EmailId.Value, phoneNumber, email);
            
            var body = $"Hi, {dto.EmailId.Value}!\n\nYou have requested to change sensitive information. Click on the link below to change it: {link}.\n\nSARM G031";

            return (subject ,body);
            
        }
        
        public async Task<(string subject, string body)> GenerateVerificationRemoveEmailContentSensitiveInfo(UpdatingPatientDto dto)
        {
            var subject = "Please verify that you want to delete your patient profile";
            var link = GenerateLinkRemoveSensitiveInfo(dto.EmailId.Value);
            var body = $"Hi, {dto.EmailId.Value}!\n\nYou have requested to delete your patient profile. Click on the link below to change it: {link}.\n\nSARM G031";

            return (subject ,body);
        }
        
        public async Task<(string subject, string body)> GenerateVerificationEmailContentSensitiveInfoStaff(String oldEmail, UpdatingStaffDto dto)
        {
            var subject = "Please verify that you want to change sensitive information";
            var baseUrl = "staff";
            var link = GenerateLinkSensitiveInfo(baseUrl, oldEmail, dto.PendingPhoneNumber, dto.PendingEmail);
            var body = $"Hi, {oldEmail}!\n\nYou have requested to change sensitive information. Click on the link below to change it: {link}.\n\nSARM G031";

            return (subject ,body);
        }
        

        public string GenerateLink(string email)
        {
            return $"{AppSettings.VerifyEmailUrl}?token={EncodeToken(email)}";
        }
        
        public string GenerateLinkSensitiveInfo(string baseUrl, string email, PhoneNumber? phoneNumber, Email? newEmail)
        {
            var url = string.Equals(baseUrl.Trim().ToLower(), "patient") ? AppSettings.SensitiveInfoPatientUrl : AppSettings.SensitiveInfoStaffUrl;

            var uriBuilder = new UriBuilder($"{url}?token={EncodeToken(email)}");
            var query = HttpUtility.ParseQueryString(uriBuilder.Query);
            
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
        
        public string GenerateLinkRemoveSensitiveInfo(string email)
        {
            return $"{AppSettings.RemoveSensitiveInfoPatientUrl}?token={EncodeToken(email)}";
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

