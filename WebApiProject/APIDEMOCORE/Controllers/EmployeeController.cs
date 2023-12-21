
using APIDEMOCORE.Encryption;
using APIDEMOCORE.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace APIDEMOCORE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeContext _context;

        public EmployeeController(EmployeeContext context)
        {
            _context = context;
        }
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<Employee>>> getEmployeeList()
        {
            return Ok(await _context.Employees. ToListAsync());
        }
        [Authorize]                       
        [HttpGet("{employeeId}")]
        public async Task<ActionResult<Employee>> getEmployeeById(int employeeId)
        {
            return Ok( _context.Employees.Where(x=>x.EmployeeId==employeeId).Select(x=>new Employee { 
            EmployeeId=x.EmployeeId,
            EmployeeName=x.EmployeeName,
            EmployeeLastName = x.EmployeeLastName,
            EmployeeAdress =x.EmployeeAdress,
            EmployeeSalary=x.EmployeeSalary,
            EmployeeUsername=x.EmployeeUsername
            
            }).FirstOrDefault());
        }
        [HttpPost]
        public async Task<ActionResult<List<Employee>>> insertEmployee(Employee employee)
        {
            
            ///Check Email Username validation
            if (await checkUsernameExistvalidation(employee.EmployeeUsername))
            {
                return BadRequest(new { Message = "Username Alreday Exists" });
            }
            /// check password length
            /// 
            var pass = checkPasswordstrength(employee.EmployeePassword);
            if (!string.IsNullOrEmpty(pass))
            {
                return BadRequest(new { Message = pass });
            }
            employee.EmployeePassword = Encryptioin.EncodePasswordToBase64(employee.EmployeePassword);
            employee.EmployeeUserType = "Admin";
            _context.Employees.Add(employee);
                await _context.SaveChangesAsync();
            return Ok(await _context.Employees.ToListAsync());
        }
        [HttpPut]
        public async Task<ActionResult<List<Employee>>> updateEmployee(Employee employee)
        {
            var getemployee = await _context.Employees.FindAsync(employee.EmployeeId);
            if (getemployee == null)
            {
                return BadRequest("Data Not Match");
            }
            getemployee.EmployeeName = employee.EmployeeName;
            getemployee.EmployeeLastName = employee.EmployeeLastName;
            getemployee.EmployeeAdress = employee.EmployeeAdress;
            getemployee.EmployeeSalary = employee.EmployeeSalary;
            getemployee.EmployeeUsername = employee.EmployeeUsername;
            
            
            //getemployee.EmployeePassword = employee.EmployeePassword;
            await _context.SaveChangesAsync();
            return Ok(await _context.Employees.ToListAsync());
        }
        
        [HttpDelete("{EmployeeId}")]
        public async Task<ActionResult<List<Employee>>> deleteEmployee(int EmployeeId)
        {
            var getemployee = await _context.Employees.FindAsync(EmployeeId);
            if (getemployee == null)
            {
                return BadRequest("Data Not Match");
            }
            _context.Employees.Remove(getemployee);
            await _context.SaveChangesAsync();
            return Ok(await _context.Employees.ToListAsync());
        }
        private Task<bool> checkUsernameExistvalidation(string username)
        => _context.Employees.AnyAsync(x => x.EmployeeUsername == username);

        private string checkPasswordstrength(string password)
        {
            StringBuilder builder = new StringBuilder();
            if (password.Length < 8)
            {
                builder.Append("Minimum Password Length Shuold be 8 !"+Environment.NewLine);
            }
            if(!(Regex.IsMatch(password,"[a-z]")&& Regex.IsMatch(password,"[A-Z]")))
            {
                builder.Append("Password Shuold be Alphanumeric !" + Environment.NewLine);
            }
            if (!(Regex.IsMatch(password, "[<,>,@,!,#,$,%,^,&,*,(,),_,+,\\[,\\],{,},?,:,;,|,',\\,.,/,~,`,-,=]")))
            {
                builder.Append("Password Shuold be contain Specail Characters!" + Environment.NewLine);
            }
            return builder.ToString();
        }   
    }
     
}
