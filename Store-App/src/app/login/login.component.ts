import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  title = 'Login';
  model: any = {};

  constructor(private authService: AuthService
            , public router: Router
            , private toaster: ToastrService) { }

  ngOnInit() {
    if(localStorage.getItem('token') !== null){
      this.router.navigate(['/orders']);
    }
  }

  login(){
    this.authService.login(this.model)
      .subscribe(
        () => {
          this.router.navigate(['/orders']);
          this.toaster.success('Logado');
        }, error => {
          this.toaster.error(`Falha no login. ${error.error}`);
        }
      )
  }

}
