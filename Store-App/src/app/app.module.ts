import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgxCurrencyModule } from "ngx-currency";
import { NgxMaskModule } from 'ngx-mask'

import { registerLocaleData } from '@angular/common';
import localeBr from '@angular/common/locales/pt';
registerLocaleData(localeBr);

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { UsersComponent } from './users/users.component';
import { ProductsComponent } from './products/products.component';
import { CostumersComponent } from './costumers/costumers.component';
import { OrdersComponent } from './orders/orders.component';
import { NeworderComponent } from './orders/neworder/neworder.component';
import { TitleComponent } from './_shared/title/title.component';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './auth/auth.interceptor';


@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      UsersComponent,
      ProductsComponent,
      CostumersComponent,
      OrdersComponent,
      TitleComponent,
      LoginComponent,
      NeworderComponent
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      BsDropdownModule.forRoot(),
      TooltipModule.forRoot(),
      ModalModule.forRoot(),
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      ToastrModule.forRoot({
         timeOut: 4000,
         preventDuplicates: true,
         progressBar: true
       }),       
      ReactiveFormsModule,
      NgxCurrencyModule,
      NgxMaskModule.forRoot()
   ],
   providers: [
      {
         provide: HTTP_INTERCEPTORS,
         useClass: AuthInterceptor,
         multi: true
      },
      {
         provide: LOCALE_ID,
         useValue: 'pt'
       }
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }

