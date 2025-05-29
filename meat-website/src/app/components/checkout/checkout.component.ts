import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { AuthService } from '../../services/auth.service';
import { LocationService, LocationDetails } from '../../services/location.service';
import { CartItem } from '../../interfaces/cart-item.interface';
import { firstValueFrom } from 'rxjs';

interface DeliveryAddress {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

interface PaymentMethod {
  type: 'cod' | 'online';
  name: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container my-5">
      <div class="row">
        <!-- Checkout Steps -->
        <div class="col-lg-8">
          <div class="checkout-steps mb-4">
            <div class="step" [class.active]="currentStep >= 1" [class.completed]="currentStep > 1">
              <span class="step-number">1</span>
              <span class="step-title">Delivery Address</span>
            </div>
            <div class="step" [class.active]="currentStep >= 2" [class.completed]="currentStep > 2">
              <span class="step-number">2</span>
              <span class="step-title">Payment Method</span>
            </div>
            <div class="step" [class.active]="currentStep >= 3">
              <span class="step-number">3</span>
              <span class="step-title">Review & Place Order</span>
            </div>
          </div>

          <!-- Step 1: Delivery Address -->
          <div class="card shadow-sm mb-4" *ngIf="currentStep === 1">
            <div class="card-body">
              <h3 class="card-title mb-4">Delivery Address</h3>
              
              <!-- Location Selector -->
              <div class="location-selector mb-4">
                <button type="button" 
                        class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
                        (click)="detectLocation()"
                        [disabled]="isDetectingLocation">
                  <i class="bi bi-geo-alt"></i>
                  {{ isDetectingLocation ? 'Detecting Location...' : 'Use Current Location' }}
                </button>
                
                <div class="detected-location mt-3" *ngIf="detectedLocation">
                  <div class="alert alert-success d-flex align-items-start">
                    <i class="bi bi-check-circle-fill me-2 mt-1"></i>
                    <div>
                      <strong>Location Detected</strong>
                      <p class="mb-0">{{ detectedLocation.formattedAddress }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <form [formGroup]="checkoutForm" (ngSubmit)="saveAddress()">
                <div formGroupName="deliveryAddress">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="fullName" class="form-label">Full Name</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="fullName"
                        formControlName="fullName">
                      <div class="text-danger" *ngIf="deliveryAddressForm.get('fullName')?.touched && deliveryAddressForm.get('fullName')?.invalid">
                        Full name is required
                      </div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label for="phoneNumber" class="form-label">Phone Number</label>
                      <input 
                        type="tel" 
                        class="form-control" 
                        id="phoneNumber"
                        formControlName="phoneNumber">
                      <div class="text-danger" *ngIf="deliveryAddressForm.get('phoneNumber')?.touched && deliveryAddressForm.get('phoneNumber')?.invalid">
                        Please enter a valid 10-digit phone number
                      </div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="addressLine1" class="form-label">Address Line 1</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="addressLine1"
                      formControlName="addressLine1">
                    <div class="text-danger" *ngIf="deliveryAddressForm.get('addressLine1')?.touched && deliveryAddressForm.get('addressLine1')?.invalid">
                      Address is required
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="addressLine2" class="form-label">Address Line 2 (Optional)</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="addressLine2"
                      formControlName="addressLine2">
                  </div>

                  <div class="row">
                    <div class="col-md-4 mb-3">
                      <label for="city" class="form-label">City</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="city"
                        formControlName="city">
                      <div class="text-danger" *ngIf="deliveryAddressForm.get('city')?.touched && deliveryAddressForm.get('city')?.invalid">
                        City is required
                      </div>
                    </div>
                    <div class="col-md-4 mb-3">
                      <label for="state" class="form-label">State</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="state"
                        formControlName="state">
                      <div class="text-danger" *ngIf="deliveryAddressForm.get('state')?.touched && deliveryAddressForm.get('state')?.invalid">
                        State is required
                      </div>
                    </div>
                    <div class="col-md-4 mb-3">
                      <label for="pincode" class="form-label">PIN Code</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="pincode"
                        formControlName="pincode">
                      <div class="text-danger" *ngIf="deliveryAddressForm.get('pincode')?.touched && deliveryAddressForm.get('pincode')?.invalid">
                        Please enter a valid 6-digit PIN code
                      </div>
                    </div>
                  </div>
                </div>

                <div class="d-flex justify-content-between mt-4">
                  <button type="button" class="btn btn-outline-brown" routerLink="/cart">
                    <i class="bi bi-arrow-left me-2"></i>Back to Cart
                  </button>
                  <button 
                    type="submit" 
                    class="btn btn-brown"
                    [disabled]="deliveryAddressForm.invalid">
                    Continue to Payment
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Step 2: Payment Method -->
          <div class="card shadow-sm mb-4" *ngIf="currentStep === 2">
            <div class="card-body">
              <h3 class="card-title mb-4">Payment Method</h3>
              <div class="payment-methods">
                <div class="form-check payment-method mb-3" *ngFor="let method of paymentMethods">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    [id]="method.type"
                    name="paymentMethod"
                    [value]="method"
                    [(ngModel)]="selectedPayment"
                    required>
                  <label class="form-check-label" [for]="method.type">
                    {{ method.name }}
                  </label>
                </div>
              </div>

              <div class="d-flex justify-content-between mt-4">
                <button type="button" class="btn btn-outline-brown" (click)="currentStep = 1">
                  <i class="bi bi-arrow-left me-2"></i>Back to Address
                </button>
                <button 
                  type="button" 
                  class="btn btn-brown"
                  [disabled]="!selectedPayment"
                  (click)="currentStep = 3">
                  Review Order
                </button>
              </div>
            </div>
          </div>

          <!-- Step 3: Review Order -->
          <div class="card shadow-sm mb-4" *ngIf="currentStep === 3">
            <div class="card-body">
              <h3 class="card-title mb-4">Review Order</h3>
              
              <!-- Delivery Address -->
              <div class="review-section mb-4">
                <h5 class="section-title">
                  <i class="bi bi-geo-alt me-2"></i>Delivery Address
                </h5>
                <div class="address-details">
                  <p class="mb-1"><strong>{{ address.fullName }}</strong></p>
                  <p class="mb-1">{{ address.phoneNumber }}</p>
                  <p class="mb-1">{{ address.addressLine1 }}</p>
                  <p class="mb-1" *ngIf="address.addressLine2">{{ address.addressLine2 }}</p>
                  <p class="mb-1">{{ address.city }}, {{ address.state }} - {{ address.pincode }}</p>
                </div>
              </div>

              <!-- Payment Method -->
              <div class="review-section mb-4">
                <h5 class="section-title">
                  <i class="bi bi-credit-card me-2"></i>Payment Method
                </h5>
                <p class="mb-0">{{ selectedPayment?.name }}</p>
              </div>

              <!-- Order Items -->
              <div class="review-section">
                <h5 class="section-title">
                  <i class="bi bi-bag me-2"></i>Order Items
                </h5>
                <div class="order-items">
                  <div class="order-item" *ngFor="let item of cartItems">
                    <div class="item-image">
                      <img [src]="item.image" [alt]="item.name">
                    </div>
                    <div class="item-details">
                      <h6 class="item-name">{{ item.name }}</h6>
                      <p class="item-weight text-muted mb-0">{{ item.weight }}</p>
                      <p class="item-price mb-0">
                        ₹{{ item.price }} × {{ item.quantity }} = ₹{{ item.price * item.quantity }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-between mt-4">
                <button type="button" class="btn btn-outline-brown" (click)="currentStep = 2">
                  <i class="bi bi-arrow-left me-2"></i>Back to Payment
                </button>
                <button 
                  type="button" 
                  class="btn btn-brown"
                  [disabled]="isProcessing"
                  (click)="placeOrder()">
                  {{ isProcessing ? 'Processing...' : 'Place Order' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="col-lg-4">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title mb-4">Order Summary</h5>
              
              <div class="d-flex justify-content-between mb-2">
                <span>Items ({{ getTotalItems() }})</span>
                <span>₹{{ getSubtotal() }}</span>
              </div>
              
              <div class="d-flex justify-content-between mb-2">
                <span>Delivery Fee</span>
                <span>₹40</span>
              </div>
              
              <hr>
              
              <div class="d-flex justify-content-between mb-0">
                <span class="fw-bold">Total Amount</span>
                <span class="fw-bold">₹{{ getTotal() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-steps {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .step {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
    }

    .step.active {
      color: #8B4513;
    }

    .step.completed {
      color: #28a745;
    }

    .step-number {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #f8f9fa;
      border: 2px solid currentColor;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .step.active .step-number,
    .step.completed .step-number {
      background-color: currentColor;
      color: white;
    }

    .step-title {
      font-weight: 500;
    }

    .payment-method {
      padding: 1rem;
      border: 1px solid #dee2e6;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      cursor: pointer;
    }

    .payment-method:hover {
      border-color: #8B4513;
    }

    .review-section {
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #dee2e6;
      margin-bottom: 1.5rem;
    }

    .review-section:last-child {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }

    .section-title {
      color: #8B4513;
      font-size: 1.1rem;
      margin-bottom: 1rem;
    }

    .order-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .order-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 0.5rem;
    }

    .item-image {
      width: 80px;
      height: 80px;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 0.25rem;
    }

    .item-details {
      flex: 1;
    }

    .item-name {
      margin-bottom: 0.25rem;
    }

    .btn-brown {
      background-color: #8B4513;
      color: white;
      transition: background-color 0.3s ease;
    }

    .btn-brown:hover:not(:disabled) {
      background-color: #693610;
      color: white;
    }

    .btn-brown:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-outline-brown {
      color: #8B4513;
      border-color: #8B4513;
    }

    .btn-outline-brown:hover {
      background-color: #8B4513;
      color: white;
    }

    @media (max-width: 768px) {
      .checkout-steps {
        flex-direction: column;
        gap: 1rem;
      }

      .step {
        width: 100%;
      }
    }

    .location-selector {
      border: 1px solid #dee2e6;
      border-radius: 0.5rem;
      padding: 1.5rem;
      background-color: #f8f9fa;
    }

    .detected-location {
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  currentStep = 1;
  cartItems: CartItem[] = [];
  isProcessing = false;
  checkoutForm: FormGroup;

  address: DeliveryAddress = {
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  };

  paymentMethods: PaymentMethod[] = [
    { type: 'cod', name: 'Cash on Delivery' },
    { type: 'online', name: 'Online Payment (Credit/Debit Card, UPI, Net Banking)' }
  ];

  selectedPayment: PaymentMethod | null = null;

  isDetectingLocation = false;
  detectedLocation: LocationDetails | null = null;

  constructor(
    private cartService: CartService,
    private ordersService: OrdersService,
    private authService: AuthService,
    private locationService: LocationService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.checkoutForm = this.fb.group({
      deliveryAddress: this.fb.group({
        fullName: ['', Validators.required],
        phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
        addressLine1: ['', Validators.required],
        addressLine2: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        pincode: ['', [Validators.required, Validators.pattern('[0-9]{6}')]]
      }),
      paymentMethod: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    // Load cart items
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      if (items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });

    // Pre-fill address if user has one
    const user = this.authService.getCurrentUser();
    if (user) {
      this.checkoutForm.patchValue({
        deliveryAddress: {
          fullName: user.name,
          phoneNumber: user.phone || '',
          addressLine1: user.address || ''
        }
      });
    }
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getTotal(): number {
    return this.getSubtotal() + 40; // Adding delivery fee
  }

  async placeOrder() {
    if (this.checkoutForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.router.navigate(['/login']);
        return;
      }

      this.isProcessing = true;

      try {
        // Get cart items synchronously
        const orderItems = await firstValueFrom(this.cartService.getCartItems());
        const total = this.getTotal();
        const deliveryAddress = this.checkoutForm.get('deliveryAddress')?.value;
        const paymentMethod = this.checkoutForm.get('paymentMethod')?.value;

        await firstValueFrom(this.ordersService.placeOrder(
          currentUser.id,
          orderItems,
          total,
          deliveryAddress,
          paymentMethod
        ));

        this.cartService.clearCart();
        this.router.navigate(['/orders']);
      } catch (error) {
        console.error('Error placing order:', error);
        // Handle error appropriately
      } finally {
        this.isProcessing = false;
      }
    } else {
      this.markFormGroupTouched(this.checkoutForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  saveAddress() {
    const deliveryAddressForm = this.checkoutForm.get('deliveryAddress');
    if (deliveryAddressForm?.valid) {
      this.currentStep = 2;
    } else {
      this.markFormGroupTouched(deliveryAddressForm as FormGroup);
    }
  }

  async detectLocation() {
    this.isDetectingLocation = true;
    try {
      const position = await this.locationService.getCurrentLocation();
      const { latitude, longitude } = position.coords;
      
      this.detectedLocation = await firstValueFrom(
        this.locationService.getAddressFromCoordinates(latitude, longitude)
      );

      // Update form with detected location
      this.deliveryAddressForm.patchValue({
        addressLine1: this.detectedLocation.address,
        city: this.detectedLocation.city,
        state: this.detectedLocation.state,
        pincode: this.detectedLocation.pincode
      });
    } catch (error) {
      console.error('Error detecting location:', error);
      // Show error message to user
      alert('Unable to detect your location. Please enter your address manually.');
    } finally {
      this.isDetectingLocation = false;
    }
  }

  get deliveryAddressForm() {
    return this.checkoutForm.get('deliveryAddress') as FormGroup;
  }
} 