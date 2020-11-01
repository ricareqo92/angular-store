import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { Product } from 'src/app/models/product';
import { global } from '../global';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl: string;
  private products$ = new BehaviorSubject<Product[]>([]);
  private productsCart$ = new BehaviorSubject<Product[]>([]);
  private exitsProduct$ = new BehaviorSubject<Boolean>(true);
  private productsTopFive$ = new BehaviorSubject<Product[]>([]); 
  private dataStore: { products: any, productsCart: any, exitsProduct: Boolean, productsTopFive: any } = { products: [], productsCart: [], exitsProduct: true, productsTopFive: [] };
  readonly products = this.products$.asObservable();
  
  constructor(
    private _http: HttpClient,
  ) {
    this.baseUrl = global.url;

  }

  get productsAll() {
    return this.products$.asObservable();
  }

  get productsCart() {
    return this.productsCart$.asObservable();
  }

  get exitsProduct() {
    return this.exitsProduct$.asObservable();
  }

  get productsTopFive() {
    return this.productsTopFive$.asObservable();
  }

  getProducts() {
    this._http.get(`${this.baseUrl}/products`).subscribe(
      data => {
        this.dataStore.products = data;
        this.products$.next(Object.assign({}, this.dataStore).products);
      }
    );
  }

  addProductsCart(product: Product) {
    this.dataStore.productsCart.push(Object.assign({}, product));
    this.productsCart$.next(Object.assign({}, this.dataStore).productsCart);
    
    if ( this.dataStore.exitsProduct ) {
      this.dataStore.exitsProduct = false;
      this.exitsProduct$.next(false);
    }
  }

  deleteProduct(id: Number) {
    this.dataStore.productsCart.splice(id, 1);    
    this.productsCart$.next(Object.assign({}, this.dataStore).productsCart);
    
    if ( this.dataStore.productsCart.length <= 0 ) {
      this.dataStore.exitsProduct = true;
      this.exitsProduct$.next(true);
    }
  }

  productFilter(type: String) {
    this._http.get<Array<any>>(`${this.baseUrl}/products`).subscribe(
      data => {
        let products: Array<Product>[] = data.filter(product => product.type === type);

        if ( products.length <= 0 ) {
          this.dataStore.products = Array.from(data);
        } else {
          this.dataStore.products = Array.from(products);
        }
        this.products$.next(Object.assign({}, this.dataStore).products);
      }
    );
  }

  getProductsTopFive() {
    this._http.get<Array<any>>(`${this.baseUrl}/products`).subscribe(
      data => {
        let productsTopFive: Product[] = [];

        if ( data.length > 0 ) {
          data.forEach(product => {
            if ( productsTopFive.length >= 5 ) {
              let productMenor = this.getShorterRating(productsTopFive);
              
              if ( product.rating > productMenor.rating ) {
                let i = productsTopFive.findIndex(item => item.id === productMenor.id);

                if ( i !== -1 ) {
                  productsTopFive.splice(i, 1);
                  productsTopFive.push(Object.assign({}, product));
                }
              }
            } else {
              productsTopFive.push(Object.assign({}, product));
            }
          });
        }

        this.dataStore.productsTopFive = Array.from(productsTopFive);
        this.productsTopFive$.next(Object.assign({}, this.dataStore).productsTopFive);
      }
    );
  }

  getShorterRating(productsTopFive) {
    let productMenor = productsTopFive[0];

    productsTopFive.forEach(product => {
      if ( product.rating < productMenor.rating ) {
        productMenor = product;
      }
    });

    return Object.assign({}, productMenor);
  }
}