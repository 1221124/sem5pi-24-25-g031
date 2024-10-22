namespace DDDNetCore.Domain.Email
{
    
    using MailKit.Net.Smtp;
    using MimeKit;
    using System.Threading.Tasks;

    public class EmailService
    {
        private readonly string _smtpServer;
        private readonly int _port;
        private readonly string _fromEmail;
        private readonly string _password;

        public EmailService(string smtpServer, int port, string fromEmail, string password)
        {
            _smtpServer = smtpServer;
            _port = port;
            _fromEmail = fromEmail;
            _password = password;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Your Name", _fromEmail));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = subject;

            message.Body = new TextPart("html")
            {
                Text = body
            };

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync(_smtpServer, _port, true);
                await client.AuthenticateAsync(_fromEmail, _password);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
        }
    }

}

