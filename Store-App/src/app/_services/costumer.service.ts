import { Injectable } from '@angular/core';
import { Costumer } from '../_models/Costumer';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CostumerService {

  baseURL = 'http://localhost:5000/costumer';
  constructor(private http: HttpClient) { }

  getAllCostumers(): Observable<Costumer[]>{
      return this.http.get<Costumer[]>(this.baseURL);
  } 

  postCostumer(model: Costumer){
      return this.http.post(`${this.baseURL}`, model)
  }

  putCostumer(costumer: Costumer){
      return this.http.put<Costumer>(`${this.baseURL}/${costumer.id}`, costumer);
  }

}
