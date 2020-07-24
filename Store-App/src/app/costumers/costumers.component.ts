import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Costumer } from '../_models/Costumer';
import { CostumerService } from '../_services/costumer.service';

@Component({
  selector: 'app-costumers',
  templateUrl: './costumers.component.html',
  styleUrls: ['./costumers.component.css']
})
export class CostumersComponent implements OnInit {
  title = "Clientes";

  costumersFiltered: Costumer[];
  costumers: Costumer[];
  costumer: Costumer;
  registerForm: FormGroup;
  saveMode: string;

  _listFilter: string;
  
  constructor(
    private costumerService: CostumerService
    , private fB: FormBuilder
    , private toastr: ToastrService) { }

  public get listFilter() : string {
    return this._listFilter;
  }  

  public set listFilter(v : string) {
    this._listFilter = v;
    this.costumersFiltered = this.listFilter ? this.filterCostumers(this.listFilter) : this.costumers;
  }  

  newCostumer(template: any){
    this.openModal(template);
    this.saveMode = 'post';
  }

  editCostumer(costumer: Costumer, template: any){
    this.openModal(template);
    this.saveMode = 'put';
    this.costumer = costumer;
    this.registerForm.patchValue(costumer);
  }

  openModal(template: any){
    this.registerForm.reset();
    template.show();
  }

  ngOnInit() {
    this.getCostumers();
    this.validation();
  }

  getCostumers(){
    this.costumerService.getAllCostumers().subscribe(
      (_costumers: Costumer[]) =>{
      this.costumers = _costumers;
      this.costumersFiltered = this.costumers;
    }, error => {
      this.toastr.error(`Erro ao tentar carregar produtos: ${error.error}`);
   
    });
  }

  filterCostumers(filterBy: string): Costumer[]{
    if(this.costumers){
      filterBy = filterBy.toLocaleLowerCase();
      return this.costumers.filter(
        product => product.companyName.toLocaleLowerCase().indexOf(filterBy) !== -1
      );
    }    
  }

  validation(){
    this.registerForm = this.fB.group({
      companyName : ['', [Validators.required, Validators.minLength(5)]],
      cnpj: ['', [Validators.required, Validators.minLength(14)]]
    });
  }

  saveChanges(template: any){
    if(this.registerForm.valid){
      if(this.saveMode == 'post'){
        this.costumer = Object.assign(this.registerForm.value);
        this.costumerService.postCostumer(this.costumer).subscribe(
          () => {
            template.hide();
            this.getCostumers();
            this.toastr.success('Cliente criado');
          }, error => {
            this.toastr.error(`Erro ao criar: ${error.error}`);
          }
        )
      }
      else{
        this.costumer = Object.assign({id: this.costumer.id}, this.registerForm.value);
        this.costumerService.putCostumer(this.costumer).subscribe(
          () => {
            template.hide();
            this.getCostumers();
            this.toastr.success('Editado com sucesso');
          }, error => {
            this.toastr.error(`Erro ao editar: ${error.error}`);
          }
        );
      }
    }
  }
}
