import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Order } from '../_models/Order';
import { OrderProduct } from '../_models/OrderProduct';
import { OrderService } from '../_services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  title = "Pedidos";

  ordersFiltered: Order[];
  orders: Order[];
  order: Order;
  _listFilter: string;
  orderProducts: OrderProduct[];
  costumerName = '';
  sellerName = '';
  totalPurchase = 0;
  orderNumber = 0;

  constructor(
    private orderService: OrderService
    , private fB: FormBuilder
    , private toastr: ToastrService) { }

  public get listFilter() : string {
    return this._listFilter;
  }

  public set listFilter(v : string) {
    this._listFilter = v;
    this.ordersFiltered = this.listFilter ? this.filterOrders(this.listFilter) : this.orders;
  } 

  ngOnInit() {
    this.getOrders()
  }

  getOrders(){
    this.orderService.getAllOrders().subscribe(
      (_orders: Order[]) =>{
      this.orders = _orders;
      this.ordersFiltered = this.orders;
    }, error => {
      this.toastr.error(`Erro ao tentar carregar pedidos: ${error.error}`);
    });
  }

  filterOrders(filterBy: string): Order[]{
    if(this.orders){
      filterBy = filterBy.toLocaleLowerCase();
      return this.orders.filter(
        order => order.id.toString().indexOf(filterBy) !== -1
      );
    }    
  }

  openOrder(id: number, template: any){
    this.orderService.getOrderById(id).subscribe(
      (_order: Order) => {
        this.orderNumber = _order.id;
        this.costumerName = _order.costumer.companyName;
        this.sellerName = _order.sellerUser;
        this.totalPurchase = _order.totalPurchaseAmount;
        this.orderProducts = _order.orderProducts;
      }, error => {
      this.toastr.error(`Erro ao tentar carregar pedidos: ${error.error}`);
    });
    template.show();
  }

}
