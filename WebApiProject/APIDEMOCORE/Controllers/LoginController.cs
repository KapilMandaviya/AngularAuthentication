using APIDEMOCORE.Data;
using APIDEMOCORE.Data.DTO;
using APIDEMOCORE.Encryption;
using APIDEMOCORE.Models;
using APIDEMOCORE.UtilityService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace APIDEMOCORE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly EmployeeContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailInterface emailInterface;
        public LoginController(EmployeeContext context,IConfiguration configuration,IEmailInterface email)
        {
            _context = context;
            _configuration = configuration;
            emailInterface = email;
        }
        [HttpPost]
        public async Task<IActionResult> authenticateLogin(Employee employee)
        {
            try
            {

                if (employee == null)
                    return BadRequest(new { Message = "enter valid username" });
                var user = await _context.Employees.FirstOrDefaultAsync(x => x.EmployeeUsername == employee.EmployeeUsername);
                if (user == null)
                {
                    return BadRequest(new { Message = "User Not Found" });
                }
                if (!(Encryptioin.DecodeFrom64(user.EmployeePassword) == employee.EmployeePassword))
                {
                    return BadRequest(new { Message = "Wrong Password Try Again" });
                }
                user.EmployeeToken = CreatejwtToken(user);
                var refreshToken = CreateRefreshToken();
                user.EmployeeRefToken = refreshToken;
                user.ExpiryTime = DateTime.Now.AddDays(5);
                await _context.SaveChangesAsync();
                return Ok(new TokenApiDto
                {
                    Token = user.EmployeeToken,
                    RefreshToken = user.EmployeeRefToken

                });
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        private string CreatejwtToken(Employee employee)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("JaiShreeKrishna..");
            var identity = new ClaimsIdentity(new Claim[] {
                new Claim(ClaimTypes.Role,employee.EmployeeUserType),
                new Claim(ClaimTypes.Name,$"{employee.EmployeeUsername}")
            });
            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
            var tokenDescripter = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddMinutes(10),
                SigningCredentials = credentials

            };
            var token = jwtTokenHandler.CreateToken(tokenDescripter);

            return jwtTokenHandler.WriteToken(token);
        }





        private string CreateRefreshToken()
        {
            var refreshToken = "";
            // Create an instance of the RandomNumberGenerator class
            using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
            {
                // Specify the number of bytes you want to generate
                int numberOfBytes = 64; // 16 bytes for example

                // Create a byte array to store the generated random bytes
                byte[] randomBytes = new byte[numberOfBytes];

                // Use the GetBytes() method to fill the array with random bytes
                rng.GetBytes(randomBytes);

                // Display the generated random bytes as a hexadecimal string

                refreshToken = Convert.ToBase64String(randomBytes);

                var tokenInUser = _context.Employees
                    .Any(a => a.EmployeeRefToken == refreshToken);
                if (tokenInUser)
                {
                    return CreateRefreshToken();
                }
            }
            return refreshToken;
        }
        private ClaimsPrincipal GetPrincipalFromEpToken(string token)
        {
            var key = Encoding.ASCII.GetBytes("JaiShreeKrishna..");
            var tokenValidationParameter = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateLifetime = false
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameter, out securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("This Is Invalid Token");
            }
            return principal;
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(Employee employee)
        {
            if (employee is null)
                return BadRequest("Invalid Request");
            string accessToken = employee.EmployeeToken;
            string refreshToken = employee.EmployeeRefToken;
            var principal = GetPrincipalFromEpToken(accessToken);
            var username = principal.Identity.Name;
            var emp = await _context.Employees.FirstOrDefaultAsync(x => x.EmployeeUsername == username);
            if (emp is null || emp.EmployeeRefToken != refreshToken || emp.ExpiryTime <= DateTime.Now)
                return BadRequest("Invalid Request");
            var newAccessToken = CreatejwtToken(emp);
            var newRefreshToken = CreateRefreshToken();

            emp.EmployeeRefToken = newRefreshToken;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                EmployeeToken = newAccessToken,
                EmployeeRefToken = newRefreshToken
            });
        }

        [HttpPost("send-email/{email}")]
        public async Task<IActionResult> SendEmail(string email)
        {
            var user =await _context.Employees.FirstOrDefaultAsync(a => a.EmployeeUsername == email);
            if (user is null)
            {
                return NotFound(new { ErrorCode = 404, Message = "User Not Exist" });

            }
            var tokenBytes = "";
            // Create an instance of the RandomNumberGenerator class
            using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
            {
                // Specify the number of bytes you want to generate
                int numberOfBytes = 64; // 16 bytes for example

                // Create a byte array to store the generated random bytes
                byte[] randomBytes = new byte[numberOfBytes];

                // Use the GetBytes() method to fill the array with random bytes
                rng.GetBytes(randomBytes);

                // Display the generated random bytes as a hexadecimal string
                tokenBytes = Convert.ToBase64String(randomBytes);
            }
            user.ResetPasswordToken = tokenBytes;
            user.ResetPassExpiry = DateTime.Now.AddMinutes(10);
            string from = _configuration["EmailSetting:from"];
            var emailModel = new EmailModel(email, "Reset Password", EmailBody.EmailStringBody(email, tokenBytes));
            emailInterface.sendEmail(emailModel);
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            
            return Ok(new
            {
                StatusCode = 200,
                Message = "Email Sent!"
            });
        }
        [HttpPost("reset-email")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var newToken = resetPasswordDto.EmailToken.Replace(" ", "+");
            var user = await _context.Employees.FirstOrDefaultAsync(a => a.EmployeeUsername == resetPasswordDto.Email);
            if (user is null)
            {
                return NotFound(new { ErrorCode = 404, Message = "User Not Exist" });
            }
            var token = user.ResetPasswordToken;
            DateTime? emailTokenExpiry = user.ResetPassExpiry;
            if (token != resetPasswordDto.EmailToken || emailTokenExpiry < DateTime.Now)
            {
                return BadRequest(new { ErrorCode = 400, Message = "Invalid Link" });
            }
            user.EmployeePassword = Encryptioin.EncodePasswordToBase64(resetPasswordDto.NewPassword);
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Password Reset SuccessFully!"
            });
        }
    }
}
