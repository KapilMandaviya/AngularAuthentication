import { Component, ViewChild } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { EmpServService } from 'src/app/Services/emp-serv.service';
import { CreateEmployeeComponent } from '../create-employee/create-employee.component';
import { Employee } from 'src/app/Models/employee';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  title = 'EmplooyeeDemo';
  emp:Employee[]=[];
  public fullname:string="";
  public role:string="";

  constructor(private empServices:EmpServService,public toast:NgToastService){     }
  @ViewChild(CreateEmployeeComponent) empcomp!:CreateEmployeeComponent;

  ngOnInit():void{
    this.empServices
    .getEmployees().subscribe((data:Employee[]) => {this.emp=data;console.log(this.emp)})

    this.empServices.getNameFromStorage().subscribe(val=>{
      
      let fullnamfromtoken=this.empServices.getFullnameFromToken();
      this.fullname=val|| fullnamfromtoken;
    })
    this.empServices.getRoleFromStorage().subscribe(val=>{
      
      let rolefromstr=this.empServices.getRoleFromToken();
      this.role=val|| rolefromstr;
    })
  }
  
  editEmployee(employeeId:number)
  {
    console.log(employeeId);
    
      this.empServices.getEmployeeById(employeeId).subscribe((data:Employee)=>{this.empServices.employeeDetail=data;console.log(this.empServices.employeeDetail);});
      console.log(this.empServices.employeeDetail);
      if(this.empcomp.isSilde==='off'){
      this.empcomp.hideShowSlide();
      this.empcomp.isShowDiv=true;
    }
  }

  deleteEmployee(employeeId:number)
  {
    if(confirm("Are You Sure,You Want to Delete this record.."))
    {
      console.log(employeeId);
      this.empServices.deleteEmployee(employeeId).subscribe(data=>{
        this.toast.warning({detail:"WARN",summary:'Record Deleted',duration:2000});

        //this.empServices.getEmployees();
       this.empServices.getEmployees().subscribe((data:Employee[]) => {this.emp=data;})
      },error => {
        console.log("record not deleted");
      });
    }
  }
  signOut(){
    this.empServices.signOut();
    this.toast.info({detail:'Success',summary:'Signout Successfully!',duration:2000});

  }

  }


