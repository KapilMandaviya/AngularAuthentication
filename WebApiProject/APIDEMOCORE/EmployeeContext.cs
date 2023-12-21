using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace APIDEMOCORE
{
    public partial class EmployeeContext : DbContext
    {
        public EmployeeContext()
        {
        }

        public EmployeeContext(DbContextOptions<EmployeeContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Employee> Employees { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=lenovo-pc;Database=Employee;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.ToTable("Employee");

                entity.Property(e => e.EmployeeId).HasColumnName("employeeId");

                entity.Property(e => e.EmployeeAdress)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("employeeAdress");

                entity.Property(e => e.EmployeeLastName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("employeeLastName");

                entity.Property(e => e.EmployeeName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("employeeName");

                entity.Property(e => e.EmployeePassword)
                    .IsRequired()
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("employeePassword");

                entity.Property(e => e.EmployeeRefToken)
                    .HasMaxLength(300)
                    .IsUnicode(false)
                    .HasColumnName("employeeRefToken");

                entity.Property(e => e.EmployeeSalary)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("employeeSalary");

                entity.Property(e => e.EmployeeToken)
                    .HasMaxLength(300)
                    .IsUnicode(false)
                    .HasColumnName("employeeToken");

                entity.Property(e => e.EmployeeUserType)
                    .IsRequired()
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("employeeUserType");

                entity.Property(e => e.EmployeeUsername)
                    .IsRequired()
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("employeeUsername");

                entity.Property(e => e.ExpiryTime)
                    .HasColumnType("datetime")
                    .HasColumnName("expiryTime");

                entity.Property(e => e.ResetPassExpiry).HasColumnType("datetime");

                entity.Property(e => e.ResetPasswordToken)
                    .HasMaxLength(300)
                    .IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
