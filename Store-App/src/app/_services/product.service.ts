import { Injectable } from '@angular/core';
import { Product } from '../_models/Product';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseURL = 'http://localhost:5000/product';
  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]>{
      return this.http.get<Product[]>(this.baseURL);
  } 

  postProduct(model: Product){
      return this.http.post(`${this.baseURL}`, model)
  }

  putProduct(product: Product){
      return this.http.put<Product>(`${this.baseURL}/${product.id}`, product);
  }
}
