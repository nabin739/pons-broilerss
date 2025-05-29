import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface SavedAddress {
  id: number;
  type: string;
  name: string;
  phone: string;
  street: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-delivery-address',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="checkout-container">
      <!-- Progress Steps -->
      <div class="progress-steps">
        <div class="step active">
          <span class="step-number">1</span>
          <span class="step-label">Delivery Address</span>
        </div>
        <div class="step-divider"></div>
        <div class="step">
          <span class="step-number">2</span>
          <span class="step-label">Payment Method</span>
        </div>
        <div class="step-divider"></div>
        <div class="step">
          <span class="step-number">3</span>
          <span class="step-label">Review Order</span>
        </div>
      </div>

      <div class="checkout-content">
        <!-- Main Content -->
        <div class="address-section">
          <h1>Select a delivery address</h1>
          
          <!-- Saved Addresses -->
          <div class="saved-addresses" *ngIf="savedAddresses.length > 0">
            <div *ngFor="let address of savedAddresses" 
                 class="address-option"
                 [class.selected]="selectedAddressId === address.id"
                 (click)="selectAddress(address.id)">
              <div class="radio-button">
                <input type="radio" 
                       [checked]="selectedAddressId === address.id"
                       name="addressSelection">
                <span class="radio-label">Deliver to this address</span>
              </div>
              <div class="address-details">
                <p class="name">{{ address.name }}</p>
                <p class="street">{{ address.street }}</p>
                <p class="phone">Phone: {{ address.phone }}</p>
              </div>
              <button class="btn-edit" (click)="editAddress(address); $event.stopPropagation()">
                Edit
              </button>
            </div>
          </div>

          <!-- Add New Address Form -->
          <div class="new-address-form">
            <div class="form-header">
              <h2>{{ savedAddresses.length > 0 ? 'Or add a new address' : 'Add a delivery address' }}</h2>
            </div>
            
            <form (ngSubmit)="saveAddress()">
              <div class="form-group">
                <label for="fullName">Full name (First and Last name)</label>
                <input type="text" 
                       id="fullName"
                       [(ngModel)]="newAddress.name" 
                       name="name" 
                       required>
              </div>

              <div class="form-group">
                <label for="phone">Mobile number</label>
                <input type="tel" 
                       id="phone"
                       [(ngModel)]="newAddress.phone" 
                       name="phone" 
                       required
                       pattern="[0-9]{10}"
                       placeholder="10-digit mobile number">
              </div>

              <div class="form-group">
                <label for="address">Address</label>
                <input type="text"
                       id="address"
                       [(ngModel)]="newAddress.street"
                       name="street"
                       required
                       placeholder="Start typing your address"
                       (input)="onAddressInput($event)">
                
                <!-- Address Suggestions -->
                <div class="address-suggestions" *ngIf="addressSuggestions.length > 0">
                  <div *ngFor="let suggestion of addressSuggestions"
                       class="suggestion-item"
                       (click)="selectSuggestion(suggestion)">
                    {{ suggestion }}
                  </div>
                </div>

                <!-- Location Detection -->
                <button type="button" 
                        class="btn-detect-location" 
                        (click)="detectCurrentLocation()">
                  <i class="bi bi-geo-alt"></i>
                  Use my current location
                </button>
              </div>

              <div class="form-group">
                <label>
                  <input type="checkbox" 
                         [(ngModel)]="saveAddressForLater"
                         name="saveAddress">
                  Save this address for later use
                </label>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-primary">
                  Use this address
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="order-summary">
          <div class="summary-header">
            <h2>Order Summary</h2>
          </div>
          <div class="summary-content">
            <div class="summary-row">
              <span>Items ({{ itemCount }})</span>
              <span>₹{{ itemsTotal }}</span>
            </div>
            <div class="summary-row">
              <span>Delivery</span>
              <span>₹{{ deliveryFee }}</span>
            </div>
            <div class="summary-row total">
              <span>Order Total</span>
              <span>₹{{ total }}</span>
            </div>
          </div>
          <button class="btn-proceed" 
                  [disabled]="!canProceed()"
                  (click)="proceedToPayment()">
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .progress-steps {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 40px;
    }

    .step {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .step-number {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #ccc;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .step.active .step-number {
      background: #E31837;
    }

    .step-divider {
      width: 60px;
      height: 2px;
      background: #ccc;
      margin: 0 15px;
    }

    .checkout-content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 30px;
    }

    .address-section {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      padding: 20px;
    }

    .saved-addresses {
      margin-bottom: 30px;
    }

    .address-option {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease;
    }

    .address-option:hover {
      border-color: #E31837;
    }

    .address-option.selected {
      border-color: #E31837;
      background: #fff5f6;
    }

    .radio-button {
      margin-bottom: 10px;
    }

    .radio-label {
      margin-left: 8px;
      font-weight: 500;
    }

    .address-details {
      margin-left: 25px;
    }

    .btn-edit {
      position: absolute;
      right: 15px;
      top: 15px;
      background: none;
      border: none;
      color: #E31837;
      cursor: pointer;
    }

    .new-address-form {
      background: white;
      padding: 20px;
      border-radius: 8px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }

    .form-group input[type="text"],
    .form-group input[type="tel"] {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }

    .address-suggestions {
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-top: 5px;
    }

    .suggestion-item {
      padding: 10px;
      cursor: pointer;
    }

    .suggestion-item:hover {
      background: #f5f5f5;
    }

    .btn-detect-location {
      background: none;
      border: none;
      color: #E31837;
      padding: 5px 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 10px;
    }

    .order-summary {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      padding: 20px;
      position: sticky;
      top: 20px;
    }

    .summary-header {
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .summary-row.total {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #eee;
      font-weight: bold;
      font-size: 1.2em;
    }

    .btn-proceed {
      width: 100%;
      background: #E31837;
      color: white;
      border: none;
      padding: 15px;
      border-radius: 4px;
      font-size: 1.1em;
      margin-top: 20px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .btn-proceed:hover {
      background: #c41530;
    }

    .btn-proceed:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .checkout-content {
        grid-template-columns: 1fr;
      }

      .order-summary {
        position: static;
      }
    }
  `]
})
export class DeliveryAddressComponent implements OnInit {
  savedAddresses: SavedAddress[] = [
    {
      id: 1,
      type: 'Home',
      name: 'John Doe',
      phone: '9876543210',
      street: '123, Green Avenue, Near City Mall',
      isDefault: true
    }
  ];

  selectedAddressId: number | null = null;
  addressSuggestions: string[] = [];
  saveAddressForLater = false;
  isDetectingLocation = false;

  // Order summary data
  itemCount = 3;
  itemsTotal = 520;
  deliveryFee = 40;
  get total() {
    return this.itemsTotal + this.deliveryFee;
  }

  newAddress = {
    type: 'Home',
    name: '',
    phone: '',
    street: ''
  };

  constructor() {}

  ngOnInit(): void {
    const defaultAddress = this.savedAddresses.find(addr => addr.isDefault);
    if (defaultAddress) {
      this.selectedAddressId = defaultAddress.id;
    }
  }

  onAddressInput(event: any): void {
    const value = event.target.value;
    // Simulate address suggestions
    if (value.length > 3) {
      this.addressSuggestions = [
        value + ' Road',
        value + ' Street',
        value + ' Avenue'
      ];
    } else {
      this.addressSuggestions = [];
    }
  }

  selectSuggestion(suggestion: string): void {
    this.newAddress.street = suggestion;
    this.addressSuggestions = [];
  }

  selectAddress(id: number): void {
    this.selectedAddressId = id;
  }

  editAddress(address: SavedAddress): void {
    this.newAddress = {
      type: address.type,
      name: address.name,
      phone: address.phone,
      street: address.street
    };
    this.selectedAddressId = null;
  }

  saveAddress(): void {
    // Implement address saving logic
    console.log('Saving address:', this.newAddress);
    if (this.saveAddressForLater) {
      this.savedAddresses.push({
        id: this.savedAddresses.length + 1,
        ...this.newAddress,
        isDefault: false
      });
    }
    this.proceedToPayment();
  }

  detectCurrentLocation(): void {
    this.isDetectingLocation = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Here you would typically make an API call to reverse geocode
          // the coordinates into an address
          console.log('Location detected:', position.coords);
          this.isDetectingLocation = false;
        },
        (error) => {
          console.error('Error detecting location:', error);
          this.isDetectingLocation = false;
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.isDetectingLocation = false;
    }
  }

  canProceed(): boolean {
    return this.selectedAddressId !== null || 
           (this.newAddress.name && 
            this.newAddress.phone && 
            this.newAddress.street);
  }

  proceedToPayment(): void {
    if (this.canProceed()) {
      // Navigate to payment page
      console.log('Proceeding to payment with address:', 
        this.selectedAddressId ? 
        this.savedAddresses.find(a => a.id === this.selectedAddressId) : 
        this.newAddress
      );
      // Add navigation logic here
    }
  }
} 