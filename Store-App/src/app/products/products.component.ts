import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../_models/Product';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  title = "Produtos";

  productsFiltered: Product[];
  products: Product[];
  product: Product;
  registerForm: FormGroup;
  saveMode: string;

  _listFilter: string;

  constructor(
    private productService: ProductService
    , private fB: FormBuilder
    , private toastr: ToastrService) { }

  public get listFilter() : string {
    return this._listFilter;
  }

  public set listFilter(v : string) {
    this._listFilter = v;
    this.productsFiltered = this.listFilter ? this.filterProducts(this.listFilter) : this.products;
  }  

  newProduct(template: any){
    this.openModal(template);
    this.saveMode = 'post';
  }

  editProduct(product: Product, template: any){
    this.openModal(template);
    this.saveMode = 'put';
    this.product = product;
    this.registerForm.patchValue(product);
  }

  openModal(template: any){
    this.registerForm.reset();
    template.show();
  }

  ngOnInit() {
    this.getProducts(),
    this.validation()
  }

  getProducts(){
    this.productService.getAllProducts().subscribe(
      (_products: Product[]) =>{
      this.products = _products;
      this.productsFiltered = this.products;
    }, error => {
      this.toastr.error(`Erro ao tentar carregar produtos: ${error.error}`);
   
    });
  }

  filterProducts(filterBy: string): Product[]{
    if(this.products){
      filterBy = filterBy.toLocaleLowerCase();
      return this.products.filter(
        product => product.name.toLocaleLowerCase().indexOf(filterBy) !== -1
      );
    }    
  }

  validation(){
    this.registerForm = this.fB.group({
      name : ['', [Validators.required, Validators.minLength(3)]],
      salePrice: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  saveChanges(template: any){
    if(this.registerForm.valid){
      if(this.saveMode == 'post'){
        this.product = Object.assign(this.registerForm.value);
        this.productService.postProduct(this.product).subscribe(
          () => {
            template.hide();
            this.getProducts();
            this.toastr.success('Produto criado');
          }, error => {
            this.toastr.error(`Erro ao criar: ${error.error}`);
          }
        )
      }
      else{
        this.product = Object.assign({id: this.product.id}, this.registerForm.value);
        this.productService.putProduct(this.product).subscribe(
          () => {
            template.hide();
            this.getProducts();
            this.toastr.success('Editado com sucesso');
          }, error => {
            this.toastr.error(`Erro ao editar: ${error.error}`);
          }
        );
      }
    }
  }
}
