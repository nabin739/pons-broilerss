import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { OrdersService, OrderItem } from '../../services/orders.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container my-5">
      <h1 class="mb-4">Shopping Cart</h1>
      
      <ng-container *ngIf="cartItems$ | async as cartItems">
        <div class="row" *ngIf="cartItems.length > 0; else emptyCart">
          <div class="col-lg-8">
            <!-- Cart Items -->
            <div class="card shadow-sm mb-4">
              <div class="card-body">
                <div class="cart-item" *ngFor="let item of cartItems">
                  <div class="row align-items-center">
                    <div class="col-3 col-md-2">
                      <img [src]="item.image" [alt]="item.name" class="img-fluid rounded">
                    </div>
                    <div class="col-9 col-md-10">
                      <div class="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 class="mb-1">{{ item.name }}</h5>
                          <p class="text-muted mb-0">{{ item.weight }}</p>
                        </div>
                        <button 
                          class="btn btn-link text-danger p-0" 
                          (click)="removeFromCart(item.id)">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                      
                      <div class="d-flex justify-content-between align-items-center mt-2">
                        <div class="quantity-controls">
                          <button 
                            class="btn btn-outline-secondary btn-sm" 
                            [disabled]="item.quantity <= 1"
                            (click)="updateQuantity(item.id, item.quantity - 1)">−</button>
                          <span class="mx-2">{{ item.quantity }}</span>
                          <button 
                            class="btn btn-outline-secondary btn-sm"
                            (click)="updateQuantity(item.id, item.quantity + 1)">+</button>
                        </div>
                        <div class="price">
                          <span class="text-muted">₹{{ item.price }} × {{ item.quantity }} = </span>
                          <span class="fw-bold">₹{{ item.price * item.quantity }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Continue Shopping -->
            <a routerLink="/" class="btn btn-outline-brown">
              <i class="bi bi-arrow-left me-2"></i>Continue Shopping
            </a>
          </div>

          <!-- Order Summary -->
          <div class="col-lg-4">
            <div class="card shadow-sm">
              <div class="card-body">
                <h5 class="card-title mb-4">Order Summary</h5>
                
                <div class="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>₹{{ getCartTotal() }}</span>
                </div>
                
                <div class="d-flex justify-content-between mb-2">
                  <span>Delivery Fee</span>
                  <span>₹40</span>
                </div>
                
                <hr>
                
                <div class="d-flex justify-content-between mb-4">
                  <span class="fw-bold">Total</span>
                  <span class="fw-bold">₹{{ getCartTotal() + 40 }}</span>
                </div>
                
                <button 
                  class="btn btn-brown w-100"
                  [disabled]="isProcessing"
                  (click)="checkout()">
                  {{ isProcessing ? 'Processing...' : 'Proceed to Checkout' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </ng-container>

      <ng-template #emptyCart>
        <div class="text-center py-5">
          <i class="bi bi-cart-x display-1 text-muted"></i>
          <h2 class="mt-4">Your cart is empty</h2>
          <p class="text-muted">Looks like you haven't added any items to your cart yet.</p>
          <a routerLink="/" class="btn btn-brown mt-3">Start Shopping</a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .cart-item {
      padding: 1rem 0;
      border-bottom: 1px solid #eee;
    }

    .cart-item:last-child {
      border-bottom: none;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
    }

    .quantity-controls button {
      width: 30px;
      height: 30px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-brown {
      background-color: #E31837;
      color: white;
    }

    .btn-brown:hover:not(:disabled) {
      background-color: #c41530;
      color: white;
    }

    .btn-brown:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-outline-brown {
      color: #E31837;
      border-color: #E31837;
    }

    .btn-outline-brown:hover {
      background-color: #E31837;
      color: white;
    }

    .text-brown {
      color: #E31837;
    }

    img {
      max-height: 80px;
      object-fit: cover;
    }

    @media (max-width: 768px) {
      .price {
        font-size: 0.9rem;
      }
    }
  `]
})
export class CartComponent {
  cartItems$: Observable<CartItem[]>;
  isProcessing = false;

  constructor(
    private cartService: CartService,
    private ordersService: OrdersService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cartItems$ = this.cartService.getCartItems();
  }

  removeFromCart(itemId: string) {
    this.cartService.removeFromCart(itemId);
  }

  updateQuantity(itemId: string, quantity: number) {
    this.cartService.updateQuantity(itemId, quantity);
  }

  getCartTotal(): number {
    return this.cartService.getCartTotal();
  }

  checkout() {
    if (!this.authService.isLoggedIn()) {
      // Redirect to login if user is not authenticated
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    // Navigate to checkout page
    this.router.navigate(['/checkout']);
  }
} 