import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';

interface WeightOption {
  weight: string;
  price: number;
}

interface Product {
  name: string;
  image: string;
  description: string;
  weightOptions: WeightOption[];
  quantity: number;
  selectedOption?: WeightOption;
}

@Component({
  selector: 'app-goat',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container my-5">
      <h1 class="mb-4">Fresh Goat Products</h1>
      
      <div class="product-grid">
        <div class="product-item" *ngFor="let product of products">
          <div class="product-card">
            <div class="img-wrapper">
              <img [src]="product.image" [alt]="product.name">
            </div>
            <div class="card-body">
              <h3>{{ product.name }}</h3>
              <p>{{ product.description }}</p>
              <div class="weight-options">
                <div class="option" *ngFor="let option of product.weightOptions">
                  <div class="price-row">
                    <div class="weight-price-info">
                      <div class="weight-info">
                        <span class="weight">{{ option.weight }}</span>
                      </div>
                      <div class="price-info">
                        <span class="price">₹{{ option.price }}</span>
                      </div>
                    </div>
                    <div class="quantity-control">
                      <div class="delivery-info">
                        <i class="bi bi-lightning-fill"></i>
                        Today in 120 mins
                      </div>
                      <div class="controls" *ngIf="product.quantity === 0 || (product.selectedOption !== option)">
                        <button class="btn btn-brown" (click)="addToCart(product, option)">Add to Cart</button>
                      </div>
                      <div class="controls quantity-buttons" *ngIf="product.quantity > 0 && product.selectedOption === option">
                        <button class="btn btn-outline-brown" (click)="decreaseQuantity(product)">−</button>
                        <span class="quantity">{{ product.quantity }}</span>
                        <button class="btn btn-outline-brown" (click)="increaseQuantity(product)">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
      margin: 0;
      padding: 8px;
    }

    .product-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: transform 0.2s;
    }

    .product-card:hover {
      transform: translateY(-5px);
    }

    .img-wrapper {
      height: 200px;
      overflow: hidden;
    }

    .img-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .card-body {
      padding: 1rem;
    }

    .card-body h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .card-body p {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .weight-options .option {
      margin-bottom: 0.5rem;
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .weight-price-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .weight-info {
      font-weight: 500;
    }

    .price-info {
      color: #E31837;
      font-weight: 600;
    }

    .quantity-control {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
    }

    .delivery-info {
      font-size: 0.8rem;
      color: #28a745;
    }

    .delivery-info i {
      margin-right: 4px;
    }

    .quantity-buttons {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .quantity-buttons button {
      width: 30px;
      height: 30px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .quantity {
      font-weight: 500;
      min-width: 20px;
      text-align: center;
    }

    .btn-brown {
      background-color: #E31837;
      color: white;
    }

    .btn-outline-brown {
      color: #E31837;
      border-color: #E31837;
    }

    .btn-outline-brown:hover {
      background-color: #E31837;
      color: white;
    }

    @media (max-width: 768px) {
      .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 16px;
        padding: 4px;
      }
    }
  `]
})
export class GoatComponent {
  products: Product[] = [
    {
      name: 'Mutton Curry with bone',
      image: 'assets/images/Mcurrywithbone.webp',
      description: 'Fresh goat meat curry cut with bone',
      quantity: 0,
      weightOptions: [
        { weight: '1 kg', price: 800 },
        { weight: '1/2 kg', price: 400 }
      ]
    },
    {
      name: 'Mutton Curry without bone',
      image: 'assets/images/Mutton Curry without Bone.jpg',
      description: 'Premium boneless goat meat pieces',
      quantity: 0,
      weightOptions: [
        { weight: '1 kg', price: 950 },
        { weight: '1/2 kg', price: 475 }
      ]
    },
    {
      name: 'Mutton Chops Curry',
      image: 'assets/images/Muttonchops.webp',
      description: 'Fresh goat Chops',
      quantity: 0,
      weightOptions: [ 
        
        { weight: '1 kg', price: 900 },

        { weight: '1/2 kg', price: 450 }
      ]
    },
    {
      name: 'Mutton Breast Curry',
      image: 'assets/images/Mbreastcurry.webp',
      description: 'Fresh goat breast',
      quantity: 0,
      weightOptions: [
        { weight: '1 kg', price: 900 },

        { weight: '1/2 kg', price: 450 }
      ]
    }
  ];

  constructor(private cartService: CartService) {}

  addToCart(product: Product, option: WeightOption): void {
    product.quantity = 1;
    product.selectedOption = option;
    
    const cartItem: CartItem = {
      id: product.name + '-' + option.weight,
      name: product.name,
      image: product.image,
      weight: option.weight,
      price: option.price,
      quantity: 1
    };

    this.cartService.addToCart(cartItem);
  }

  increaseQuantity(product: Product): void {
    if (product.selectedOption) {
      product.quantity++;
      this.cartService.addToCart({
        id: product.name + '-' + product.selectedOption.weight,
        name: product.name,
        image: product.image,
        weight: product.selectedOption.weight,
        price: product.selectedOption.price,
        quantity: product.quantity
      });
    }
  }

  decreaseQuantity(product: Product): void {
    if (product.quantity > 0) {
      product.quantity--;
      if (product.quantity === 0) {
        product.selectedOption = undefined;
      }
      if (product.selectedOption) {
        this.cartService.addToCart({
          id: product.name + '-' + product.selectedOption.weight,
          name: product.name,
          image: product.image,
          weight: product.selectedOption.weight,
          price: product.selectedOption.price,
          quantity: product.quantity
        });
      }
    }
  }
}