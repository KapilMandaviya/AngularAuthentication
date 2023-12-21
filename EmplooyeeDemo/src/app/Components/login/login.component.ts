  import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { EmpServService } from 'src/app/Services/emp-serv.service';
import { Employee } from 'src/app/Models/employee';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent{

  public resetPasswordEmail!:string;
  constructor(
    private fb: FormBuilder,
    private toast: NgToastService,
    public Employeeservice:EmpServService,    
    public router: Router) { }
 
    public loginForm!: FormGroup;
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  
 
  ngOnInit():void {
   this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }
  onSubmit(form:NgForm) {
    console.log(this.Employeeservice.employeeDetail);
      
      this.Employeeservice.loginEmployee().subscribe({
        next: (success:any) => {
          this.toast.success({
            detail: 'Success',
            summary:success.message,
            duration:2500     
          });
          this.Employeeservice.setToken(success.token);
          this.Employeeservice.storeRefreshToken(success.refreshToken)
          console.log('Refresh TOken Manaual :'+success.refreshToken)
          
          const tokenPayload=this.Employeeservice.decodeTokens();
          
          this.Employeeservice.setNameFromStore(tokenPayload.unique_name);
          this.Employeeservice.setRoleFromStore(tokenPayload.role);
          this.resetForm(form);
          this.router.navigate(['dashboard']);
        },
        
        error:(err:any)=>{
          this.toast.error({
            detail:'error',
            summary: 'Something Went Wrong, Trg Again!',
            // summary:err.message,
            duration:2500,
            position:'topRight'
          });
        }

      });
  
  }

 
  resetForm(myform:NgForm)
  {
    myform.form.reset(myform.value);
    this.Employeeservice.employeeDetail=new Employee();
  }
  confirmToReset(){
    if(this.checkValidEmail(this.resetPasswordEmail))
    {
      console.log(this.resetPasswordEmail);
      this.Employeeservice.SendResetPassword(this.resetPasswordEmail).subscribe({
        next:(res)=>{
          this.toast.success({detail:"Success",summary:res.message,duration:3000});
          
          this.resetPasswordEmail="";
          const btnref= document.getElementById("closeBtn");
          btnref?.click();

        },error:(err)=>{
          this.toast.error({detail:"Error",summary:"Something went wrong",duration:3000});
        }
      })
    }
  } 
  public isValidEmail!: boolean;
  checkValidEmail(event: string) {
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  
}



