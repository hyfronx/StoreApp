import { Injectable } from '@angular/core';
import { User } from '../_models/User';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class UserService {

    baseURL = 'http://localhost:5000/user';
    constructor(private http: HttpClient) { }
    
    getAllUsers(): Observable<User[]>{
        return this.http.get<User[]>(this.baseURL);
    }
    
    register(model: any){
        return this.http.post(`${this.baseURL}/register`, model)
    }
    
    putUser(user: User){
        return this.http.put<User>(`${this.baseURL}/${user.id}`, user);
    }
}
