import { Injectable } from '@angular/core';
import { Employee } from '../Models/employee';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'
import { TokenApiModel } from '../Models/token-api-model';
import { ResetPassword } from '../Models/resetpassword.model';
@Injectable({
  providedIn: 'root'
})
export class EmpServService {
  private url="Employee"
  private loginUrl="Login"
  private userpayload:any;
  private fullname$=new BehaviorSubject<string>("");
  private role$=new BehaviorSubject<string>(""); 
  constructor(private http:HttpClient,private route:Router) { 
    this.userpayload=this.decodeTokens();

  }
  listEmployee:Employee[]=[]
  employeeDetail:Employee=new Employee();
  
  public  getEmployees():Observable<Employee[]>
  {
  
    return this.http.get<Employee[]>(`${environment.apiUrl}/${this.url}`)
  }

  saveEmployee()
  {

    return this.http.post(`${environment.apiUrl}/${this.url}`,this.employeeDetail);
  }

  updateEmployee()
  {
    return this.http.put(`${environment.apiUrl}/${this.url}`,this.employeeDetail);

  }
  getEmployeeById(employeeId:number)
  {
    return this.http.get<Employee>(`${environment.apiUrl}/${this.url}/${employeeId}`);

  }
  deleteEmployee(employeeId:number)
  {
    
    return this.http.delete(`${environment.apiUrl}/${this.url}/${employeeId}`);
  
  }
  loginEmployee(){
      return this.http.post(`${environment.apiUrl}/${this.loginUrl}`,this.employeeDetail)

  }
  signOut(){
    localStorage.clear();
    this.route.navigate(['login']);
  }
  setToken(tokenvalue:string){
    localStorage.setItem('token',tokenvalue);

  }
  getToken(){
    return localStorage.getItem('token');
  }
  IsLogin():boolean{
    return !!localStorage.getItem('token');

  }
  public getRoleFromStorage()
  {
    return this.role$.asObservable();
  }
  public setRoleFromStore(role:string){
    this.role$.next(role);
  }
  public getNameFromStorage()
  {
    return this.fullname$.asObservable();
  }
  public setNameFromStore(unique_name:string){
    this.fullname$.next(unique_name);
  }

  decodeTokens()
  {
    const jwthelper=new JwtHelperService();
    const token=this.getToken()!;
    console.log(jwthelper.decodeToken(token));
    return jwthelper.decodeToken(token);
  }
  getFullnameFromToken(){
    if(this.userpayload)
      return this.userpayload.unique_name;
  }
  getRoleFromToken(){
    if(this.userpayload)
      return this.userpayload.role;
  }
  storeRefreshToken(token:string)
  {
    localStorage.setItem('refreshToken',token)
  }
  getRefreshToken()
  {
    return localStorage.getItem('refreshToken')
  }

  renewToken(employee:Employee){
    return this.http.post<any>(`${environment.apiUrl}/${this.loginUrl}/refresh`,employee)
  }
  SendResetPassword(email:string){
    return this.http.post<any>(`${environment.apiUrl}/${this.loginUrl}/send-email/${email}`,{})
  }
  resetPassword(resetPasswordModel:ResetPassword)
  {
    return this.http.post<any>(`${environment.apiUrl}/${this.loginUrl}/reset-email`,resetPasswordModel)

  }
}

