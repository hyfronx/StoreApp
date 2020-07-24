import { Injectable } from '@angular/core';
import { Order } from '../_models/Order';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseURL = 'http://localhost:5000/order';
  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<Order[]>{
      return this.http.get<Order[]>(this.baseURL);
  } 

  getOrderById(id: number): Observable<Order>{
        return this.http.get<Order>(`${this.baseURL}/${id}`);
    }    

  postOrder(model: Order){
    return this.http.post(`${this.baseURL}`, model)
}
}
