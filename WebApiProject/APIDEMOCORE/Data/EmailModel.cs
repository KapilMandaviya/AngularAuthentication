using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIDEMOCORE.Data
{
    public class EmailModel
    {
        public string To { get; set; }
        public string  Subject { get; set; }

        public string Content { get; set; }

        public EmailModel(string to, string subject, string content)
        {
            To = to;
            Subject = subject;
            Content = content;
            
        }
    }
}
