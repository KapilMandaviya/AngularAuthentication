import { Injectable } from '@angular/core';
import {HttpRequest,HttpHandler,HttpEvent,HttpInterceptor,HttpErrorResponse} from '@angular/common/http';
import { EmpServService } from '../Services/emp-serv.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import {  catchError, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Employee } from '../Models/employee';
import { TokenApiModel } from '../Models/token-api-model';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private empService:EmpServService,private toast:NgToastService,private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const mytoken=this.empService.getToken();
    //This Type Working
    request=request.clone({
        setHeaders:{Authorization:`Bearer ${mytoken}`}
     })
    return next.handle(request).pipe(
      catchError((err:any)=>{
        if(err instanceof HttpErrorResponse)
        {
          if(err.status===401)
          {
              // this.toast.warning({detail:'Warning',summary:'Token Is Expired,Login Again',duration:2500,position:'topCenter'});
              // this.router.navigate(['login'])
              return this.handleUnAuthorizedError(request,next);  
          }
        }
        return throwError(()=>new Error("Some Internal Error Generate"))
    })
  )}
    
  handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandler){
    let tokeApiModel = new Employee();
    tokeApiModel.employeeToken = this.empService.getToken()!;
    tokeApiModel.employeeRefToken = this.empService.getRefreshToken()!;
    console.log("handle anuthorized error "+tokeApiModel.employeeToken);
    return this.empService.renewToken(tokeApiModel).
    pipe(
      switchMap((emp:Employee)=>{
        this.empService.storeRefreshToken(emp.employeeRefToken);
        this.empService.setToken(emp.employeeToken);
        console.log("switch map "+emp.employeeRefToken);
        req=req.clone({
          setHeaders:{Authorization:`Bearer ${emp.employeeToken }`}
       })
        return next.handle(req);
      }),

      catchError((err)=>{
        return throwError(()=>{
          this.toast.warning({detail:"Warning", summary:"Token is expired, Please Login again"});
          this.router.navigate(['login'])
        })
      })  
    )
    }
  }
  

