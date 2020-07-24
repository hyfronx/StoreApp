import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private authService: AuthService
              , public router: Router
              , private toaster: ToastrService) { }

  ngOnInit() {
  }

  loggedIn(){
    return this.authService.loggedIn();
  }

  logout(){
    localStorage.removeItem('token');
    this.toaster.show('Deslogado');
    this.router.navigate(['/user/login']);
  }

  userName(){
    return sessionStorage.getItem('userName');
  }
}
