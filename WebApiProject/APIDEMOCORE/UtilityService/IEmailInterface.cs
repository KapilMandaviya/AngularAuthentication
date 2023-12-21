using APIDEMOCORE.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIDEMOCORE.UtilityService
{
    public interface IEmailInterface
    {
        void sendEmail(EmailModel emailModel);
    }
}
