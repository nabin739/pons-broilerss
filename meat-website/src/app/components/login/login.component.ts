import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow">
            <div class="card-body p-5">
              <h2 class="text-center mb-4">Login</h2>
              
              <div *ngIf="error" class="alert alert-danger">
                {{ error }}
              </div>
              
              <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
                <div class="mb-3">
                  <label for="email" class="form-label">Email address</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    name="email"
                    [(ngModel)]="email"
                    required
                    email
                    #emailInput="ngModel">
                  <div class="text-danger" *ngIf="emailInput.invalid && emailInput.touched">
                    Please enter a valid email address
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password"
                    name="password"
                    [(ngModel)]="password"
                    required
                    minlength="6"
                    #passwordInput="ngModel">
                  <div class="text-danger" *ngIf="passwordInput.invalid && passwordInput.touched">
                    Password must be at least 6 characters long
                  </div>
                </div>

                <div class="text-end mb-3">
                  <a routerLink="/forgot-password" class="text-brown text-decoration-none">Forgot Password?</a>
                </div>

                <button 
                  type="submit" 
                  class="btn btn-brown w-100 mb-3"
                  [disabled]="loginForm.invalid || isLoading">
                  {{ isLoading ? 'Logging in...' : 'Login' }}
                </button>

                <div class="text-center">
                  <p class="mb-0">Don't have an account? 
                    <a routerLink="/register" class="text-brown">Create Account</a>
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

    .btn-brown:disabled {
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
  `]
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  error: string = '';
  returnUrl: string = '/';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    if (this.email && this.password) {
      this.isLoading = true;
      this.error = '';
      
      this.authService.login(this.email, this.password)
        .subscribe({
          next: () => {
            this.router.navigateByUrl(this.returnUrl);
          },
          error: (error) => {
            console.error('Login failed:', error);
            this.error = 'Invalid email or password';
            this.isLoading = false;
          }
        });
    }
  }
} 