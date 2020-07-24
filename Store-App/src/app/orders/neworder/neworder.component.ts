import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Costumer } from 'src/app/_models/Costumer';
import { Order } from 'src/app/_models/Order';
import { Product } from 'src/app/_models/Product';
import { CostumerService } from 'src/app/_services/costumer.service';
import { OrderService } from 'src/app/_services/order.service';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-neworder',
  templateUrl: './neworder.component.html',
  styleUrls: ['./neworder.component.css']
})

export class NeworderComponent implements OnInit {

  title = 'Novo Pedido';
  order: Order;
  registerForm: FormGroup;
  costumers: Costumer[];
  products: Product[];
  totalPurchase = 0.00;


  get orderProducts(): FormArray {
    return <FormArray>this.registerForm.get('orderProducts');
  }

    constructor(
    private orderService: OrderService
    , private costumerService: CostumerService
    , private fB: FormBuilder
    , private toastr: ToastrService
    , private productService: ProductService
    , public router: Router) { }

  ngOnInit() {
    this.validation();
    this.getCostumers();
    this.getProducts();
  }

  validation() {
    this.registerForm = this.fB.group({
      id: [],
      totalPurchaseAmount: ['', Validators.min(0.01)],
      costumerId: ['', Validators.required],
      orderProducts: this.fB.array([])
    });
  }

  createOrderProduct(orderProduct: any): FormGroup {
    return this.fB.group({
      productId: [orderProduct.productId, Validators.required],
      quantity: [orderProduct.quantity, Validators.required],
      salePrice: [orderProduct.salePrice, Validators.required],
      amount:[orderProduct.amount, '']
    });
  }

  addOrderProduct() {
    this.orderProducts.push(this.createOrderProduct({ id: 0 }));
  }

  removeOrderProduct(id: number) {
    var amount = this.orderProducts.get(id+'.amount').value;
    this.totalPurchase -= amount;
    this.registerForm.patchValue({totalPurchaseAmount: this.totalPurchase});

    this.orderProducts.removeAt(id);
  }

  getCostumers(){
    this.costumerService.getAllCostumers().subscribe(
      (_costumers: Costumer[]) =>{
      this.costumers = _costumers;
    }, error => {
      this.toastr.error(`Erro ao tentar carregar clientes: ${error.error}`);
    });
  }

  getProducts(){
    this.productService.getAllProducts().subscribe(
      (_products: Product[]) =>{  
      this.products = _products;
    }, error => {
      this.toastr.error(`Erro ao tentar carregar produtos: ${error.error}`);
    });
  }

  updateTotalAmount(){
    console.log("atualizado");
  }

  userName(){
    return sessionStorage.getItem('userName');
  }

  getTotalItem(i: any, quantity: number){
    var productPrice = this.orderProducts.get(i+'.salePrice').value;
    var total = quantity * productPrice;
    var valueDifference = total - this.orderProducts.get(i+'.amount').value;

    this.orderProducts.controls[i].patchValue({
      amount: total
    });

    this.totalPurchase += valueDifference;

    this.registerForm.patchValue({totalPurchaseAmount: this.totalPurchase});
  }

  setProductPrice(i: any, valor: any){
    var id = +valor.split(':')[1];
    var productPrice = this.products.find(x => x.id == id).salePrice;
    this.orderProducts.controls[i].patchValue({
      salePrice: productPrice
    });
  }

  finishOrder() {
    this.order = Object.assign({}, this.registerForm.value);
    this.order.id = 0;

    this.orderService.postOrder(this.order).subscribe(
      () => {
        this.toastr.success('Pedido concluído!');
        this.router.navigate(['/orders']);
      }, error => {
        console.log(error);
        this.toastr.error(`Erro ao fianlizar: ${error.error}`);
      }
    );
  }
}