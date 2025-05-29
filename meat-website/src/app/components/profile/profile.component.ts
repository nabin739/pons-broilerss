import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Order {
  orderId: string;
  date: string;
  total: number;
  status: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface Address {
  id: number;
  type: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="profile-container">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="user-info">
          <div class="avatar">
            <img [src]="user.avatar || 'assets/images/default-avatar.png'" alt="User avatar">
          </div>
          <div class="user-details">
            <h2>{{ user.name }}</h2>
            <p>{{ user.email }}</p>
            <p>Member since {{ user.joinDate }}</p>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="profile-content">
        <!-- Sidebar Navigation -->
        <div class="profile-nav">
          <ul>
            <li [class.active]="activeSection === 'orders'"
                (click)="activeSection = 'orders'">
                <i class="bi bi-box-seam"></i> My Orders
            </li>
            <li [class.active]="activeSection === 'addresses'"
                (click)="activeSection = 'addresses'">
                <i class="bi bi-geo-alt"></i> Addresses
            </li>
            <li [class.active]="activeSection === 'personal'"
                (click)="activeSection = 'personal'">
                <i class="bi bi-person"></i> Personal Information
            </li>
            <li [class.active]="activeSection === 'settings'"
                (click)="activeSection = 'settings'">
                <i class="bi bi-gear"></i> Account Settings
            </li>
          </ul>
        </div>

        <!-- Content Area -->
        <div class="content-area">
          <!-- Orders Section -->
          <div *ngIf="activeSection === 'orders'" class="orders-section">
            <h3>My Orders</h3>
            <div class="orders-list">
              <div *ngFor="let order of orders" class="order-card">
                <div class="order-header">
                  <div class="order-id">Order #{{ order.orderId }}</div>
                  <div class="order-date">{{ order.date }}</div>
                  <div class="order-status" [class]="order.status.toLowerCase()">
                    {{ order.status }}
                  </div>
                </div>
                <div class="order-items">
                  <div *ngFor="let item of order.items" class="order-item">
                    <span>{{ item.name }}</span>
                    <span>{{ item.quantity }}x</span>
                    <span>₹{{ item.price }}</span>
                  </div>
                </div>
                <div class="order-footer">
                  <div class="order-total">Total: ₹{{ order.total }}</div>
                  <button class="btn-reorder">Reorder</button>
                </div>
              </div>
            </div>
                  </div>

          <!-- Addresses Section -->
          <div *ngIf="activeSection === 'addresses'" class="addresses-section">
            <h3>My Addresses</h3>
            <button class="btn-add-address">
              <i class="bi bi-plus"></i> Add New Address
            </button>
            <div class="addresses-list">
              <div *ngFor="let address of addresses" class="address-card">
                <div class="address-type">{{ address.type }}</div>
                <div class="address-details">
                  <p class="name">{{ address.name }}</p>
                  <p class="phone">{{ address.phone }}</p>
                  <p class="street">{{ address.street }}</p>
                  <p class="city-state">{{ address.city }}, {{ address.state }}</p>
                  <p class="pincode">{{ address.pincode }}</p>
                </div>
                <div class="address-actions">
                  <button class="btn-edit">Edit</button>
                  <button class="btn-delete">Delete</button>
                  <button *ngIf="!address.isDefault" class="btn-make-default">
                    Make Default
                </button>
                  <span *ngIf="address.isDefault" class="default-badge">
                    Default Address
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Personal Information Section -->
          <div *ngIf="activeSection === 'personal'" class="personal-section">
            <h3>Personal Information</h3>
            <form class="personal-form">
              <div class="form-group">
                <label>Full Name</label>
                <input type="text" [(ngModel)]="user.name" name="name">
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" [(ngModel)]="user.email" name="email">
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input type="tel" [(ngModel)]="user.phone" name="phone">
              </div>
              <div class="form-group">
                <label>Date of Birth</label>
                <input type="date" [(ngModel)]="user.dob" name="dob">
              </div>
              <button class="btn-save">Save Changes</button>
              </form>
          </div>

          <!-- Settings Section -->
          <div *ngIf="activeSection === 'settings'" class="settings-section">
            <h3>Account Settings</h3>
            <div class="settings-list">
              <div class="setting-item">
                <h4>Password</h4>
                <button class="btn-change">Change Password</button>
              </div>
              <div class="setting-item">
                <h4>Notifications</h4>
                <div class="notification-settings">
                  <label class="toggle">
                    <input type="checkbox" [(ngModel)]="settings.emailNotifications" name="emailNotifications">
                    <span class="slider"></span>
                    Email Notifications
                  </label>
                  <label class="toggle">
                    <input type="checkbox" [(ngModel)]="settings.smsNotifications" name="smsNotifications">
                    <span class="slider"></span>
                    SMS Notifications
                  </label>
                </div>
              </div>
              <div class="setting-item">
                <h4>Delete Account</h4>
                <button class="btn-delete-account">Delete My Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .profile-header {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
    }

    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-details h2 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }

    .user-details p {
      margin: 5px 0;
      color: #666;
    }

    .profile-content {
      display: flex;
      gap: 20px;
    }

    .profile-nav {
      width: 250px;
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .profile-nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .profile-nav li {
      padding: 12px 15px;
      margin: 5px 0;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .profile-nav li:hover {
      background: #f5f5f5;
    }

    .profile-nav li.active {
      background: #E31837;
      color: white;
    }

    .content-area {
      flex: 1;
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    /* Orders Section Styles */
    .order-card {
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .order-status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .order-status.delivered {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .order-status.processing {
      background: #fff3e0;
      color: #ef6c00;
    }

    .order-items {
      border-top: 1px solid #eee;
      padding: 10px 0;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      margin: 5px 0;
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
    }

    /* Address Section Styles */
    .address-card {
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      position: relative;
    }

    .address-type {
      font-weight: bold;
      color: #E31837;
      margin-bottom: 10px;
    }

    .address-details p {
      margin: 5px 0;
    }

    .address-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }

    /* Form Styles */
    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      color: #666;
    }

    .form-group input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    /* Button Styles */
    button {
      padding: 8px 16px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-save {
      background: #E31837;
      color: white;
    }

    .btn-edit {
      background: #f5f5f5;
      color: #333;
    }

    .btn-delete {
      background: #ffebee;
      color: #E31837;
    }

    .btn-add-address {
      background: #E31837;
      color: white;
      margin-bottom: 20px;
    }

    /* Settings Styles */
    .setting-item {
      padding: 20px 0;
      border-bottom: 1px solid #eee;
    }

    .setting-item:last-child {
      border-bottom: none;
    }

    .toggle {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 10px 0;
      cursor: pointer;
    }

    .slider {
      position: relative;
      width: 50px;
      height: 24px;
      background: #ccc;
      border-radius: 12px;
      transition: 0.3s;
    }

    .slider:before {
      content: "";
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      top: 2px;
      left: 2px;
      transition: 0.3s;
    }

    input:checked + .slider {
      background: #E31837;
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }

    @media (max-width: 768px) {
      .profile-content {
        flex-direction: column;
      }

      .profile-nav {
        width: 100%;
      }

      .user-info {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  activeSection = 'orders';
  
  user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    dob: '1990-01-01',
    joinDate: 'Jan 2024',
    avatar: null
  };

  orders: Order[] = [
    {
      orderId: 'OD123456',
      date: '2024-03-15',
      total: 450,
      status: 'Delivered',
      items: [
        { name: 'Chicken Breast', quantity: 2, price: 200 },
        { name: 'Country Chicken', quantity: 1, price: 250 }
      ]
    },
    {
      orderId: 'OD123457',
      date: '2024-03-10',
      total: 320,
      status: 'Processing',
      items: [
        { name: 'Japanese Quail', quantity: 2, price: 320 }
      ]
    }
  ];

  addresses: Address[] = [
    {
      id: 1,
      type: 'Home',
      name: 'John Doe',
      phone: '+91 9876543210',
      street: '123, Green Avenue',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      isDefault: true
    },
    {
      id: 2,
      type: 'Office',
      name: 'John Doe',
      phone: '+91 9876543210',
      street: '456, Business Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400002',
      isDefault: false
    }
  ];

  settings = {
    emailNotifications: true,
    smsNotifications: true
  };

  constructor() {}

  ngOnInit(): void {}
} 