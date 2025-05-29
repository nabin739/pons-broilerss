import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow">
            <div class="card-body p-5">
              <h2 class="text-center mb-4">Create Account</h2>
              
              <!-- Error Message -->
              <div *ngIf="error" class="alert alert-danger alert-dismissible fade show" role="alert">
                {{ error }}
                <button type="button" class="btn-close" (click)="error = ''"></button>
              </div>

              <!-- Success Message -->
              <div *ngIf="success" class="alert alert-success alert-dismissible fade show" role="alert">
                {{ success }}
                <button type="button" class="btn-close" (click)="success = ''"></button>
              </div>
              
              <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
                <div class="mb-3">
                  <label for="name" class="form-label">Full Name</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="name" 
                    name="name"
                    [(ngModel)]="user.name"
                    required
                    minlength="3"
                    #nameInput="ngModel"
                    [class.is-invalid]="nameInput.invalid && nameInput.touched">
                  <div class="invalid-feedback" *ngIf="nameInput.invalid && nameInput.touched">
                    <span *ngIf="nameInput.errors?.['required']">Name is required</span>
                    <span *ngIf="nameInput.errors?.['minlength']">Name must be at least 3 characters long</span>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email address</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    name="email"
                    [(ngModel)]="user.email"
                    required
                    email
                    #emailInput="ngModel"
                    [class.is-invalid]="emailInput.invalid && emailInput.touched">
                  <div class="invalid-feedback" *ngIf="emailInput.invalid && emailInput.touched">
                    Please enter a valid email address
                  </div>
                </div>

                <div class="mb-3">
                  <label for="phone" class="form-label">Phone Number</label>
                  <div class="input-group">
                    <input 
                      type="tel" 
                      class="form-control" 
                      id="phone" 
                      name="phone"
                      [(ngModel)]="user.phone"
                      required
                      pattern="[0-9]{10}"
                      #phoneInput="ngModel"
                      [class.is-invalid]="phoneInput.invalid && phoneInput.touched"
                      [disabled]="isPhoneVerified">
                    <button 
                      type="button" 
                      class="btn btn-outline-brown" 
                      (click)="sendOTP()"
                      [disabled]="phoneInput.invalid || isOtpSent || isPhoneVerified || isOtpLoading">
                      <span *ngIf="!isOtpLoading">{{ isOtpSent ? 'Resend OTP' : 'Send OTP' }}</span>
                      <span *ngIf="isOtpLoading" class="spinner-border spinner-border-sm" role="status"></span>
                    </button>
                  </div>
                  <div class="invalid-feedback" *ngIf="phoneInput.invalid && phoneInput.touched">
                    Please enter a valid 10-digit phone number
                  </div>
                </div>

                <div class="mb-3" *ngIf="isOtpSent && !isPhoneVerified">
                  <label for="otp" class="form-label">Enter OTP</label>
                  <div class="input-group">
                    <input 
                      type="text" 
                      class="form-control" 
                      id="otp" 
                      [(ngModel)]="otp"
                      name="otp"
                      required
                      pattern="[0-9]{6}"
                      #otpInput="ngModel"
                      [class.is-invalid]="otpInput.invalid && otpInput.touched">
                    <button 
                      type="button" 
                      class="btn btn-outline-brown" 
                      (click)="verifyOTP()"
                      [disabled]="otpInput.invalid || isOtpVerifying">
                      <span *ngIf="!isOtpVerifying">Verify OTP</span>
                      <span *ngIf="isOtpVerifying" class="spinner-border spinner-border-sm" role="status"></span>
                    </button>
                  </div>
                  <div class="invalid-feedback" *ngIf="otpInput.invalid && otpInput.touched">
                    Please enter the 6-digit OTP
                  </div>
                  <div class="form-text text-success" *ngIf="isPhoneVerified">
                    Phone number verified successfully!
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Create Password</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password"
                    name="password"
                    [(ngModel)]="user.password"
                    required
                    minlength="6"
                    #passwordInput="ngModel"
                    [class.is-invalid]="passwordInput.invalid && passwordInput.touched">
                  <div class="invalid-feedback" *ngIf="passwordInput.invalid && passwordInput.touched">
                    Password must be at least 6 characters long
                  </div>
                </div>

                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="confirmPassword"
                    name="confirmPassword"
                    [(ngModel)]="confirmPassword"
                    required
                    #confirmPasswordInput="ngModel"
                    [class.is-invalid]="!passwordsMatch() && confirmPasswordInput.touched">
                  <div class="invalid-feedback" *ngIf="!passwordsMatch() && confirmPasswordInput.touched">
                    Passwords do not match
                  </div>
                </div>

                <div class="mb-3">
                  <label for="address" class="form-label">Address</label>
                  <textarea 
                    class="form-control" 
                    id="address" 
                    name="address"
                    [(ngModel)]="user.address"
                    required
                    rows="3"
                    #addressInput="ngModel"
                    [class.is-invalid]="addressInput.invalid && addressInput.touched"></textarea>
                  <div class="invalid-feedback" *ngIf="addressInput.invalid && addressInput.touched">
                    Please enter your delivery address
                  </div>
                </div>

                <button 
                  type="submit" 
                  class="btn btn-brown w-100 mb-3"
                  [disabled]="registerForm.invalid || !isPhoneVerified || !passwordsMatch() || isLoading">
                  <span *ngIf="!isLoading">Create Account</span>
                  <span *ngIf="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
                </button>

                <div class="text-center">
                  <p class="mb-0">Already have an account? 
                    <a routerLink="/login" class="text-brown">Login</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-brown {
      color: #E31837;
    }

    .btn-brown {
      background-color: #E31837;
      color: white;
      transition: background-color 0.3s ease;
    }

    .btn-brown:hover:not(:disabled) {
      background-color: #c41530;
      color: white;
    }

    .btn-outline-brown {
      color: #E31837;
      border-color: #E31837;
    }

    .btn-outline-brown:hover:not(:disabled) {
      background-color: #E31837;
      color: white;
    }

    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .card {
      border-radius: 10px;
      border: none;
    }

    .form-control:focus {
      border-color: #E31837;
      box-shadow: 0 0 0 0.2rem rgba(227, 24, 55, 0.25);
    }

    .invalid-feedback {
      font-size: 0.875em;
    }

    .alert {
      margin-bottom: 1.5rem;
    }

    .spinner-border {
      width: 1rem;
      height: 1rem;
      border-width: 0.15em;
    }
  `]
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    phone: '',
    password: '',
    address: ''
  };

  confirmPassword: string = '';
  otp: string = '';
  isOtpSent: boolean = false;
  isPhoneVerified: boolean = false;
  isLoading: boolean = false;
  isOtpLoading: boolean = false;
  isOtpVerifying: boolean = false;
  error: string = '';
  success: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  passwordsMatch(): boolean {
    return this.user.password === this.confirmPassword;
  }

  sendOTP() {
    if (!this.user.phone) return;
    
    this.isOtpLoading = true;
    this.error = '';
    
    this.authService.sendOTP(this.user.phone)
      .subscribe({
        next: () => {
          this.isOtpSent = true;
          this.success = 'OTP sent successfully!';
          this.isOtpLoading = false;
        },
        error: (error) => {
          this.error = error.message || 'Failed to send OTP. Please try again.';
          this.isOtpLoading = false;
        }
      });
  }

  verifyOTP() {
    if (!this.otp) return;

    this.isOtpVerifying = true;
    this.error = '';
    
    this.authService.verifyOTP(this.user.phone, this.otp)
      .subscribe({
        next: () => {
          this.isPhoneVerified = true;
          this.success = 'Phone number verified successfully!';
          this.isOtpVerifying = false;
        },
        error: (error) => {
          this.error = error.message || 'Invalid OTP. Please try again.';
          this.isOtpVerifying = false;
        }
      });
  }

  onSubmit() {
    if (!this.isPhoneVerified) {
      this.error = 'Please verify your phone number first.';
      return;
    }

    if (!this.passwordsMatch()) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.register(this.user)
      .subscribe({
        next: () => {
          this.success = 'Account created successfully! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.error = error.message || 'Failed to create account. Please try again.';
          this.isLoading = false;
        }
      });
  }
} 