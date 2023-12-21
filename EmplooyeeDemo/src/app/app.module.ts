import { NgModule, createComponent } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { AppComponent } from './app.component';
import { CreateEmployeeComponent } from './Components/create-employee/create-employee.component';
import { NgToastModule } from 'ng-angular-popup'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LoginComponent } from './Components/login/login.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module'
import { TokenInterceptor } from './Interceptor/token.interceptor';
import { ResetComponent } from './Components/reset/reset.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateEmployeeComponent,
    LoginComponent,
    DashboardComponent,
    ResetComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    NgToastModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:TokenInterceptor,
    multi:true  

}],
  bootstrap: [AppComponent]
})
export class AppModule { }
