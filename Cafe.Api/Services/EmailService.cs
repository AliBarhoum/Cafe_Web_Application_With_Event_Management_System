using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Extensions.Logging;

namespace Cafe.Api.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendWelcomeEmail(string email, string firstName)
        {
            await SendEmail(email, "Welcome to Cafe! 🎉",
                $"<h1>Welcome, {firstName}!</h1><p>We're thrilled to have you at Cafe.</p>");
        }

        public async Task SendVerificationEmail(string email, string firstName, string confirmationLink)
        {
            await SendEmail(email, "Verify your email",
                $"<p>Hi {firstName},</p><p><a href='{confirmationLink}'>Confirm your email</a></p>");
        }

        public async Task SendResetPasswordEmail(string email, string resetLink)
        {
            await SendEmail(email, "Reset your password",
                $"<p><a href='{resetLink}'>Click here to reset your password</a></p>");
        }

        private async Task SendEmail(string toEmail, string subject, string htmlBody)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");
            var smtpServer = emailSettings["SmtpServer"];
            var smtpPort = int.Parse(emailSettings["SmtpPort"] ?? "587");
            var senderEmail = emailSettings["SenderEmail"];
            var senderName = emailSettings["SenderName"] ?? "Cafe";
            var password = emailSettings["Password"];

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(senderName, senderEmail));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = subject;
            message.Body = new TextPart("html") { Text = htmlBody };

            using var client = new SmtpClient();

            // ✅ Use 'Auto' instead of 'StartTls' (Gmail accepts both)
            await client.ConnectAsync(smtpServer!, smtpPort, SecureSocketOptions.Auto);

            // ✅ Use the App Password exactly as you did in PowerShell
            await client.AuthenticateAsync(senderEmail, password!);

            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            _logger.LogInformation("✅ Email sent to {ToEmail}", toEmail);
        }
    }
}