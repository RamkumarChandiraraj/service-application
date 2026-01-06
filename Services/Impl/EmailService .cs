using Microsoft.Extensions.Configuration;
using Services.Interface;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Services.Impl
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string to, string subject, string htmlBody)
        {
            if (string.IsNullOrWhiteSpace(to))
                throw new ArgumentException("Recipient email address is required");

            var smtpHost = _config["EmailSettings:SmtpHost"];
            var smtpPort = _config["EmailSettings:SmtpPort"];
            var username = _config["EmailSettings:Username"];
            var password = _config["EmailSettings:Password"];
            var fromEmail = _config["EmailSettings:FromEmail"];

            if (string.IsNullOrWhiteSpace(fromEmail))
                throw new ArgumentException("FromEmail is missing in EmailSettings");

            var mail = new MailMessage
            {
                From = new MailAddress(fromEmail),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true // 🔥 IMPORTANT
            };

            mail.To.Add(to);

            using var smtp = new SmtpClient(smtpHost!, int.Parse(smtpPort!))
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = true
            };

            await smtp.SendMailAsync(mail);
        }
    }
}
