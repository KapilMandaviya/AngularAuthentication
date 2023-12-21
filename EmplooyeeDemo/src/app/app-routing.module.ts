import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { CreateEmployeeComponent } from './Components/create-employee/create-employee.component';
import { employeeAuthGuard } from './gaurd/employee-auth.guard';
import { ResetComponent } from './Components/reset/reset.component';


const routes:Routes=[
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'createemployee',component:CreateEmployeeComponent},
{path:'reset',component:ResetComponent},

  {path:'dashboard',component:DashboardComponent,canActivate:[employeeAuthGuard]}
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)],
 exports:[RouterModule]   
})
export class AppRoutingModule{}