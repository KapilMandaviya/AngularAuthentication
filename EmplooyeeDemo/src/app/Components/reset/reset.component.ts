import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ResetPassword } from 'src/app/Models/resetpassword.model';
import { EmpServService } from 'src/app/Services/emp-serv.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit{
  /**
   *;
   */
 public resetForm!:FormGroup;
  emailToken!:string;
  email!:string
  resetPasswordModel=new ResetPassword();

  constructor(private fb:FormBuilder,
    public EmployeeServices:EmpServService,
    private ActivateRouter:ActivatedRoute,
    private router:Router,
    private Toaster:NgToastService
    ) {
  }

  ngOnInit(): void {
    this.resetForm=this.fb.group({
      newPassword:[null,Validators.required],
      confirmPassword:[null,Validators.required]
      },
      {
        validator: this.ConfirmPasswordValidators("newPassword", "confirmPassword")
      });

      this.ActivateRouter.queryParams.subscribe(val=>{
        console.log(val);
        this.email=val['email'];
        let uritoken=(val['code']);
        this.emailToken=uritoken.replace(/ /g,'+');
        console.log(this.emailToken);
        console.log(this.email);
      })
    }

  newpassword: string = 'password';
  confirmpassword: string = 'password';
  
  isTNewText: boolean = false;
  isConfirmText: boolean = false;
  NewPassIcon: string = 'fa-eye-slash';
  ConfirmPassIcon: string = 'fa-eye-slash';

  hideShowNewPass() {
    this.isTNewText = !this.isTNewText;
    this.isTNewText ? (this.NewPassIcon = 'fa-eye') : (this.NewPassIcon = 'fa-eye-slash');
    this.isTNewText ? (this.newpassword = 'text') : (this.newpassword = 'password');
  }
  hideShowConfirmPass() {
    this.isConfirmText = !this.isConfirmText;
    this.isConfirmText ? (this.ConfirmPassIcon = 'fa-eye') : (this.ConfirmPassIcon = 'fa-eye-slash');
    this.isConfirmText ? (this.confirmpassword = 'text') : (this.confirmpassword = 'password');
  }

  ConfirmPasswordValidators (NewPassword:string,ConfirmPasswordControl:string) {
    return (formgroup:FormGroup)=>{
      const NewpasswordControl=formgroup.controls[NewPassword];
        const ConfirmpasswordControl=formgroup.controls[ConfirmPasswordControl];
        if(NewpasswordControl.errors && !NewpasswordControl.errors["ConfirmPasswordValidators"])
        {
          return;
        }
        if(NewpasswordControl.value !== ConfirmpasswordControl.value)
        {
          ConfirmpasswordControl.setErrors({ConfirmPasswordValidators:true})
        }
        else{ConfirmpasswordControl.setErrors(null)}


    }  
  }
  onSubmit()
  {
      if(this.resetForm.valid)
      {
        this.resetPasswordModel.email=this.email;
        this.resetPasswordModel.emailToken=this.emailToken;
        this.resetPasswordModel.newPassword=this.resetForm.value.newPassword;
        this.resetPasswordModel.confirmPassword=this.resetForm.value.confirmPassword;
        this.EmployeeServices.resetPassword(this.resetPasswordModel).subscribe({
          next: (res) => {
            this.Toaster.success({
              detail: 'SUCCESS',
              summary: res.message,
              duration: 3000,
            });
            this.router.navigate(['/'])
          },
          error: (err) => {
            this.Toaster.error({
              detail: 'SUCCESS',
              summary: "Something went wrong",
              duration: 3000,
            });
          }
        })
    }
   
  }
}
