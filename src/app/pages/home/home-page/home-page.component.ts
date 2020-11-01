import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product/product.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  products: any;
  productsCart: any;
  showProductCart: any;
  filterOptions: String[];
  productsTopFive: any;

  constructor(
    private _productService: ProductService,
  ) {
    this.filterOptions = ['zapatos', 'tecnologia', 'reloj'];
  }

  ngOnInit() {
    this.products = this._productService.productsAll;
    this.productsCart = this._productService.productsCart;
    this.showProductCart = this._productService.exitsProduct;
    this.productsTopFive = this._productService.productsTopFive;

    this._productService.getProducts();
    this._productService.getProductsTopFive();

    console.log(this.productsTopFive);
    
  }

  addProductCart(product: Product) {    
    this._productService.addProductsCart(product);
  }

  deleteProductCart(id: Number) {    
    this._productService.deleteProduct(id);
  }

  productFilter(event) {
    console.log(event.target.value);
    
    this._productService.productFilter(event.target.value);
  }

}
