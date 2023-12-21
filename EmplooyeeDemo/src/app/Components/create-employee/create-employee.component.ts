import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { Employee } from 'src/app/Models/employee';
import { EmpServService } from 'src/app/Services/emp-serv.service';
import { AppComponent } from 'src/app/app.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent {


constructor(public empService:EmpServService,public components:DashboardComponent,public toast:NgToastService) { }
@ViewChild('checkbox1') checkbox!:ElementRef;
isSilde:string='off';
isShowDiv=false;
ngOnInit():void{

  
}

submit(form:NgForm)
{
  if(this.empService.employeeDetail.employeeId==0)
  {
    this.isShowDiv=!this.isShowDiv;
    console.log(this.empService.employeeDetail);
    console.log(form);
    this.insertEmployee(form);
    this.hideShowSlide();
  }
  else{
    
    this.updateEployee(form);
    
  }
}



insertEmployee(myform:NgForm)
  {  this.empService.saveEmployee().subscribe(d=> {
     this.resetForm(myform);
     this.refereshData();
     
     this.toast.success({detail:"Success",summary:'Record Saved',duration:2000});
    });
  }
  updateEployee(myform:NgForm)
  {
    this.empService.updateEmployee().subscribe(d=> {
      this.resetForm(myform);
      this.refereshData();
      
      this.toast.warning({detail:"WARN",summary:'Record Updated',duration:2000});
    });
  } 
  resetForm(myform:NgForm)
  {
    myform.form.reset(myform.value);
    this.empService.employeeDetail=new Employee();
    this.hideShowSlide();
  }
  refereshData()
  {
    this.empService.getEmployees().subscribe((data:Employee[])=>{this.components.emp=data});
    

  }
  hideShowSlide()
  {
    if(this.checkbox.nativeElement.checked)
    {

      this.checkbox.nativeElement.checked=false;
      this.isSilde='off';
      
    }
    else{
      this.checkbox.nativeElement.checked=true;
      this.isSilde='on'; 
      this.refereshData();
     
    }

  }

  
}
