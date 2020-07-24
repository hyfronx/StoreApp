import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/User';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  title = "Usuários";

  usersFiltered: User[];
  users: User[];
  user: User;
  registerForm: FormGroup;
  saveMode: string;

  _listFilter: string;
  
  constructor(
    private userService: UserService
    , private fB: FormBuilder
    , private toastr: ToastrService
    ){}

  public get listFilter() : string {
    return this._listFilter;
  }
  
  public set listFilter(v : string) {
    this._listFilter = v;
    this.usersFiltered = this.listFilter ? this.filterUsers(this.listFilter) : this.users;
  }   

  newUser(template: any){
    this.openModal(template);
    this.saveMode = 'post';
  }

  editUser(user: User, template: any){
    this.openModal(template);
    this.saveMode = 'put';
    this.user = user;
    this.registerForm.patchValue(user);
  }

  openModal(template: any){
    this.registerForm.reset();
    template.show();
  }

  ngOnInit() {
    this.getUsers(),
    this.validation()
  }

  getUsers(){
    this.userService.getAllUsers().subscribe(
      (_users: User[]) =>{
      this.users = _users;
      this.usersFiltered = this.users;
    }, error => {
      this.toastr.error(`Erro ao tentar carregar usuários: ${error.error}`);
   
    });
  }

  filterUsers(filterBy: string): User[]{
    if(this.users){
      filterBy = filterBy.toLocaleLowerCase();
      return this.users.filter(
        user => user.userName.toLocaleLowerCase().indexOf(filterBy) !== -1
      );
    }    
  }

  validation(){
    this.registerForm = this.fB.group({
      fullName : ['', [Validators.required, Validators.minLength(5)]],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      userName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
      passwords : this.fB.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      }, {validator : this.comparePassword})
    });
  }

  comparePassword(fb: FormGroup){
    const confirmPass = fb.get('confirmPassword');
    if(confirmPass.errors == null || 'mismatch' in confirmPass.errors){
      if (fb.get('password').value !== confirmPass.value){
        confirmPass.setErrors({mismatch : true});
      }else{
        confirmPass.setErrors(null);
      }
    }
  }

  saveChanges(template: any){
    if(this.registerForm.valid){
      if(this.saveMode == 'post'){
        this.user = Object.assign({password: this.registerForm.get('passwords.password').value}, this.registerForm.value);
        this.userService.register(this.user).subscribe(
          () => {
            template.hide();
            this.getUsers();
            this.toastr.success('Usuário criado');
          }, error => {
            const erro = error.error;
            erro.forEach(element => {
              switch(element.code){
                case 'DuplicateUserName':
                    this.toastr.error('O nome de usuário informado já existe!');
                    break;
                default:
                    this.toastr.error(`Erro. CODE: ${element.code}`);
                    break;
              }
            });
          }
        )
      }
      else{
        this.user = Object.assign({id: this.user.id, password: this.registerForm.get('passwords.password').value}, this.registerForm.value);
        this.userService.putUser(this.user).subscribe(
          () => {
            template.hide();
            this.getUsers();
            this.toastr.success('Editado com sucesso');
          }, error => {
            this.toastr.error(`Erro ao editar: ${error.error}`);
          }
        );
      }
    }
  }

}
