using System;
using System.Collections.Generic;

#nullable disable

namespace APIDEMOCORE.Models
{
    public partial class Employee
    {
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeLastName { get; set; }
        public string EmployeeAdress { get; set; }
        public string EmployeeSalary { get; set; }
        public string EmployeeUsername { get; set; }
        public string EmployeePassword { get; set; }
        public string EmployeeUserType { get; set; }
        public string? EmployeeToken { get; set; } = null;
        public string? EmployeeRefToken { get; set; } = null;
    }
}
