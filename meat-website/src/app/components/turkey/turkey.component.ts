import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';

interface TurkeyProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  variants: {
    weight: string;
    price: number;
  }[];
  quantity: number;
  selectedVariant?: {
    weight: string;
    price: number;
  };
}

@Component({
  selector: 'app-turkey',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container my-5">
      <h1 class="mb-4">Turkey Bird</h1>
      
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
                <div class="option" *ngFor="let variant of product.variants">
                  <div class="price-row">
                    <div class="weight-price-info">
                      <div class="weight-info">
                        <span class="weight">{{ variant.weight }}</span>
                      </div>
                      <div class="price-info">
                        <span class="price">₹{{ variant.price }}</span>
                      </div>
                    </div>
                    <div class="quantity-control">
                      <div class="delivery-info">
                        <i class="bi bi-lightning-fill"></i>
                        Today in 120 mins
                      </div>
                      <div class="controls" *ngIf="product.quantity === 0 || (product.selectedVariant !== variant)">
                        <button class="btn btn-brown" (click)="addToCart(product, variant)">Add to Cart</button>
                      </div>
                      <div class="controls quantity-buttons" *ngIf="product.quantity > 0 && product.selectedVariant === variant">
                        <button class="btn btn-outline-brown" (click)="decreaseQuantity(product)">−</button>
                        <span class="quantity">{{ product.quantity }}</span>
                        <button class="btn btn-outline-brown" (click)="increaseQuantity(product, variant)">+</button>
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
export class TurkeyComponent {
  products: TurkeyProduct[] = [
    {
      id: 'TR001',
      name: 'Turkey Bird Meat',
      description: 'Premium quality turkey meat, perfect for roasting and special occasions. Available only on Sundays.',
      image: 'assets/images/turkey.jfif',
      variants: [
        { weight: '1 kg', price: 700 }
      ],
      quantity: 0
    }
  ];

  constructor(private cartService: CartService) {}

  addToCart(product: TurkeyProduct, variant: { weight: string; price: number }) {
    product.quantity = 1;
    product.selectedVariant = variant;
    
    const cartItem: CartItem = {
      id: `${product.id}-${variant.weight}`,
      name: product.name,
      image: product.image,
      weight: variant.weight,
      price: variant.price,
      quantity: 1
    };

    this.cartService.addToCart(cartItem);
  }

  increaseQuantity(product: TurkeyProduct, variant: { weight: string; price: number }) {
    product.quantity++;
    
    const cartItem: CartItem = {
      id: `${product.id}-${variant.weight}`,
      name: product.name,
      image: product.image,
      weight: variant.weight,
      price: variant.price,
      quantity: product.quantity
    };

    this.cartService.addToCart(cartItem);
  }

  decreaseQuantity(product: TurkeyProduct) {
    if (product.quantity > 0) {
      product.quantity--;
      if (product.quantity === 0) {
        product.selectedVariant = undefined;
      }
      if (product.selectedVariant) {
        const cartItem: CartItem = {
          id: `${product.id}-${product.selectedVariant.weight}`,
          name: product.name,
          image: product.image,
          weight: product.selectedVariant.weight,
          price: product.selectedVariant.price,
          quantity: product.quantity
        };
        this.cartService.addToCart(cartItem);
      }
    }
  }
}