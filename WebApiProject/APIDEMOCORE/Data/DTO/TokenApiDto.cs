using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIDEMOCORE.Data.DTO
{
    public class TokenApiDto
    {
        public string Token { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;

    }
}
