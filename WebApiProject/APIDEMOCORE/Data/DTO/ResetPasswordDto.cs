using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIDEMOCORE.Data.DTO
{
    public class ResetPasswordDto
    {
        public string Email { get; set; }
        public string EmailToken { get; set; }
        public string  NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
