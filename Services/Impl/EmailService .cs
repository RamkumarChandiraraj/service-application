using Microsoft.Extensions.Configuration;
using Services.Interface;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using static Org.BouncyCastle.Math.EC.ECCurve;

namespace Services.Impl
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration configuration)
        {
            _config = configuration;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            if (string.IsNullOrWhiteSpace(to))
                throw new ArgumentException("Recipient email address is null or empty");

            var smtpHost = _config["EmailSettings:SmtpHost"];
            var smtpPort = _config["EmailSettings:SmtpPort"];
            var username = _config["EmailSettings:Username"];
            var password = _config["EmailSettings:Password"];
            var from = _config["EmailSettings:FromEmail"];

            if (string.IsNullOrWhiteSpace(from))
                throw new ArgumentException("FromEmail is missing in configuration");

            using var message = new MailMessage
            {
                From = new MailAddress(from),
                Subject = subject,
                Body = body,
                IsBodyHtml = false
            };

            message.To.Add(new MailAddress(to));

            using var client = new SmtpClient(smtpHost!, int.Parse(smtpPort!))
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = true
            };

            await client.SendMailAsync(message);
        }
    }
}

