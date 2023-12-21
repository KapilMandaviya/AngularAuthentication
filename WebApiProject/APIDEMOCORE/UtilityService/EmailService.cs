using APIDEMOCORE.Data;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIDEMOCORE.UtilityService
{
    public class EmailService : IEmailInterface
    {
        private readonly IConfiguration _configuration;
        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
            
        }
        public void sendEmail(EmailModel emailModel)
        {
            var emailMessage = new MimeMessage();
            var from = _configuration["EmailSetting:from"];
            emailMessage.From.Add(new MailboxAddress("Kapil Mandaviya", from));
            emailMessage.To.Add(new MailboxAddress(emailModel.To, emailModel.To));
            emailMessage.Subject = emailModel.Subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = string.Format(emailModel.Content)
            };

            using (var client = new SmtpClient())
            {
                try
                {
                    client.Connect(_configuration["EmailSetting:SmtpServer"], 465, true);
                    client.Authenticate(_configuration["EmailSetting:from"], _configuration["EmailSetting:Password"]);
                    client.Send(emailMessage);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally {
                    client.Disconnect(true);
                    client.Dispose();
                }
            }
        }
    }
}
