import { Injectable } from '@angular/core';
import {  CanActivate, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EmpServService } from '../Services/emp-serv.service';
import {NgToastService } from 'ng-angular-popup';

@Injectable({
providedIn:'root'

})
export class employeeAuthGuard implements CanActivate
{ 

  constructor(private empService:EmpServService,
    private route:Router,
    private toast:NgToastService
    ){}
  canActivate():boolean {
    if(this.empService.IsLogin()){
      return true
    }
    else{
      this.toast.error({detail:'Error',summary:'Please Login!'});
      this.route.navigate(['login']);
      return false
    }
  }
  
}
