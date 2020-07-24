import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CostumersComponent } from './costumers/costumers.component';
import { OrdersComponent } from './orders/orders.component';
import { NeworderComponent } from './orders/neworder/neworder.component';
import { ProductsComponent } from './products/products.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'costumers', component: CostumersComponent, canActivate: [AuthGuard]},
  {path: 'products', component: ProductsComponent, canActivate: [AuthGuard]},
  {path: 'orders', component: OrdersComponent, canActivate: [AuthGuard]},
  {path: 'orders/neworder', component: NeworderComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
