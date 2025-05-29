import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CartService, CartItem } from '../../services/cart.service';
import { SearchService, SearchResult } from '../../services/search.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-white">
      <div class="container">
        <!-- Logo -->
        <a class="navbar-brand" (click)="navigateToHome($event)">
          <img src="./assets/images/logo.png" alt="Meat Shop Logo" height="50">
        </a>
        
        <!-- Mobile Toggle -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <!-- Main Navigation Content -->
        <div class="collapse navbar-collapse" id="navbarContent">
          <!-- Location Selector -->
          <div class="nav-item location-selector">
            <i class="bi bi-geo-alt"></i>
            <a href="https://g.co/kgs/Lxbc95d" target="_blank" class="location-link">
              <span class="location-text">Thoothukudi</span>
              <span class="location-subtext">Tamil Nadu, India</span>
            </a>
          </div>

          <!-- Enhanced Search Bar -->
          <div class="nav-item search-container">
            <div class="search-wrapper">
              <input
                class="form-control search-input" 
                type="search" 
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearchChange($event)"
                (focus)="showResults = true"
                (click)="showResults = true"
                placeholder="Search for meat products..."
                name="search"
                autocomplete="off">
              <button class="btn btn-outline-brown" type="button">
                <i class="bi bi-search"></i>
              </button>

              <!-- Search Results Dropdown -->
              <div class="search-results-dropdown" *ngIf="showResults" (mousedown)="$event.preventDefault()">
                <!-- Recent Searches -->
                <div class="search-section" *ngIf="!searchQuery && recentSearches.length > 0">
                  <h6 class="section-title">Recent Searches</h6>
                  <div class="search-item" *ngFor="let search of recentSearches" (click)="selectSuggestion(search)">
                    <i class="bi bi-clock-history"></i>
                    <span>{{ search }}</span>
                  </div>
                </div>

                <!-- Popular Searches -->
                <div class="search-section" *ngIf="!searchQuery">
                  <h6 class="section-title">Popular Searches</h6>
                  <div class="search-item" *ngFor="let search of popularSearches" (click)="selectSuggestion(search)">
                    <i class="bi bi-fire"></i>
                    <span>{{ search }}</span>
                  </div>
                </div>

                <!-- Search Results -->
                <div class="search-results" *ngIf="searchResults.length > 0">
                  <div class="result-item" *ngFor="let result of searchResults" (click)="navigateTo(result.route, $event)">
                    <img [src]="result.image" [alt]="result.name" class="result-image">
                    <div class="result-details">
                      <div class="result-name">{{ result.name }}</div>
                      <div class="result-category">in {{ result.category }}</div>
                      <div class="result-price">₹{{ result.price }}</div>
                    </div>
                  </div>
                </div>

                <!-- No Results -->
                <div class="no-results" *ngIf="searchResults.length === 0 && searchQuery">
                  <i class="bi bi-search"></i>
                  <p>No products found for "{{ searchQuery }}"</p>
                  <small>Try searching for different terms or browse our categories</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Navigation Items -->
          <ul class="navbar-nav ms-auto">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Categories
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" (click)="navigateTo('/chicken', $event)">Chicken</a></li>
                <li><a class="dropdown-item" (click)="navigateTo('/country-chicken', $event)">Country Chicken</a></li>
                <li><a class="dropdown-item" (click)="navigateTo('/japanese-quail', $event)">Japanese Quail</a></li>
                <li><a class="dropdown-item" (click)="navigateTo('/turkey', $event)">Turkey Bird</a></li>
                <li><a class="dropdown-item" (click)="navigateTo('/goat', $event)">Goat</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <ng-container *ngIf="authService.currentUser$ | async as user; else loginLink">
                <div class="dropdown">
                  <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person"></i> My Account
                  </a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" (click)="navigateTo('/orders', $event)">
                      <i class="bi bi-box-seam me-2"></i>My Orders
                    </a></li>
                    <li><a class="dropdown-item" (click)="navigateTo('/profile', $event)">
                      <i class="bi bi-person-circle me-2"></i>Profile Settings
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" (click)="logout($event)">
                      <i class="bi bi-box-arrow-right me-2"></i>Logout
                    </a></li>
                  </ul>
                </div>
              </ng-container>
              <ng-template #loginLink>
                <a class="nav-link" (click)="navigateTo('/login', $event)">
                  <i class="bi bi-person"></i> Login
                </a>
              </ng-template>
            </li>
            <li class="nav-item">
              <a class="nav-link cart-link" (click)="navigateTo('/cart', $event)">
                <i class="bi bi-cart3"></i>
                <div class="cart-info" *ngIf="cartService.getCartItemsCount() > 0">
                  <span class="items-count">{{ cartService.getCartItemsCount() }} items</span>
                  <span class="total-amount">₹{{ cartService.getCartTotal() }}</span>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    /* Navbar styles */
    .navbar {
      box-shadow: 0 1px 1px rgba(0,0,0,0.1);
      padding: 0;
      height: 56px;
      min-height: 56px;
    }

    .navbar-brand {
      padding: 0;
      margin-right: 2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    /* Location Selector Styles */
    .location-selector {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 1rem;
      border-right: 1px solid #e0e0e0;
      margin-right: 1rem;
      height: 100%;
    }

    .location-selector i {
      color: #E31837;
      font-size: 1rem;
    }

    .location-link {
      text-decoration: none;
      display: flex;
      flex-direction: column;
      color: inherit;
    }

    .location-text {
      font-weight: 500;
      font-size: 0.9rem;
      color: #333;
    }

    .location-subtext {
      font-size: 0.75rem;
      color: #666;
    }

    /* Enhanced Search Styles */
    .search-container {
      flex: 1;
      max-width: 600px;
      position: relative;
      margin: 0 1rem;
      height: 100%;
      display: flex;
      align-items: center;
    }

    .search-wrapper {
      display: flex;
      position: relative;
      width: 100%;
    }

    .search-input {
      border-radius: 4px 0 0 4px !important;
      border-right: none;
      padding-right: 40px;
      font-size: 0.9rem;
      height: 36px;
    }

    .search-input:focus {
      box-shadow: none;
      border-color: #E31837;
    }

    .btn-outline-brown {
      color: #E31837;
      border-color: #E31837;
      border-radius: 0 4px 4px 0;
      border-left: none;
      padding: 0.375rem 1rem;
      height: 36px;
    }

    .btn-outline-brown:hover {
      color: white;
      background-color: #E31837;
    }

    /* Search Results Dropdown */
    .search-results-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      margin-top: 4px;
      z-index: 1000;
      max-height: 400px;
      overflow-y: auto;
    }

    .search-section {
      padding: 12px 16px;
      border-bottom: 1px solid #eee;
    }

    .section-title {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .search-item {
      display: flex;
      align-items: center;
      padding: 8px;
      cursor: pointer;
      transition: background-color 0.2s;
      border-radius: 4px;
    }

    .search-item:hover {
      background-color: #f5f5f5;
    }

    .search-item i {
      margin-right: 12px;
      color: #666;
    }

    .result-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      cursor: pointer;
      transition: background-color 0.2s;
      border-bottom: 1px solid #eee;
    }

    .result-item:hover {
      background-color: #f5f5f5;
    }

    .result-image {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
      margin-right: 12px;
    }

    .result-details {
      flex: 1;
    }

    .result-name {
      font-weight: 500;
      color: #333;
      margin-bottom: 2px;
    }

    .result-category {
      font-size: 12px;
      color: #666;
    }

    .result-price {
      font-weight: 500;
      color: #8B4513;
      font-size: 14px;
    }

    .no-results {
      padding: 24px 16px;
      text-align: center;
      color: #666;
    }

    .no-results i {
      font-size: 24px;
      margin-bottom: 8px;
      color: #999;
    }

    .no-results p {
      margin-bottom: 4px;
      font-weight: 500;
    }

    .no-results small {
      color: #999;
    }

    /* Cart Link Styles */
    .cart-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px !important;
      background-color: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      margin-left: 1rem;
      height: 36px;
    }

    .cart-link:hover {
      background-color: #f8f8f8;
    }

    .cart-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      line-height: 1.1;
    }

    .items-count {
      font-size: 0.75rem;
      color: #666;
    }

    .total-amount {
      font-weight: 600;
      color: #E31837;
      font-size: 0.85rem;
    }

    /* Navigation Items */
    .navbar-nav {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .nav-item {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .nav-link {
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 1rem;
      font-size: 0.9rem;
    }

    /* Responsive Styles */
    @media (max-width: 992px) {
      .navbar-collapse {
        position: fixed;
        top: 56px;
        left: 0;
        right: 0;
        background: white;
        padding: 1rem;
        height: calc(100vh - 56px);
        overflow-y: auto;
      }

      .location-selector {
        border-right: none;
        border-bottom: 1px solid #e0e0e0;
        padding: 1rem 0;
        margin: 0 0 1rem 0;
        height: auto;
      }

      .search-container {
        margin: 1rem 0;
        max-width: 100%;
        height: auto;
      }

      .cart-link {
        margin: 1rem 0;
        width: 100%;
        justify-content: center;
        height: 42px;
      }

      .search-results-dropdown {
        position: fixed;
        top: auto;
        bottom: 0;
        left: 0;
        right: 0;
        max-height: 80vh;
        margin: 0;
        border-radius: 12px 12px 0 0;
      }

      .nav-item {
        height: auto;
      }

      .nav-link {
        height: auto;
        padding: 0.5rem 0;
      }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchQuery = '';
  showResults = false;
  searchResults: SearchResult[] = [];
  recentSearches: string[] = [];
  popularSearches: string[] = [];
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private searchService: SearchService,
    public cartService: CartService,
    public authService: AuthService,
    private router: Router
  ) {
    this.popularSearches = this.searchService.getPopularSearches();
    this.recentSearches = this.searchService.getRecentSearches();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      if (query) {
        this.searchService.search(query).subscribe(results => {
          this.searchResults = results;
          this.showResults = true;
        });
      } else {
        this.searchResults = [];
      }
    });

    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-container')) {
        this.hideResults();
      }
    });
  }

  ngOnInit() {
    // Subscribe to router events to handle scroll behavior
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });
  }

  navigateToHome(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/']);
    window.scrollTo(0, 0);
  }

  navigateTo(path: string, event: Event): void {
    event.preventDefault();
    this.router.navigate([path]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  onSearchChange(query: string) {
    this.searchSubject.next(query);
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
    this.navigateTo('/', event);
  }

  addToCart(product: SearchResult) {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      image: product.image,
      weight: '500g', // Default weight
      price: product.price,
      quantity: 1
    };

    this.cartService.addToCart(cartItem);
  }

  selectSuggestion(suggestion: string) {
    this.searchQuery = suggestion;
    this.onSearchChange(suggestion);
  }

  performSearch() {
    if (this.searchQuery.trim()) {
      this.searchService.search(this.searchQuery).subscribe(results => {
        if (results.length > 0) {
          // If we have results, save the search
          this.searchService.addRecentSearch(this.searchQuery);
          
          // Navigate to the first result's route
          this.navigateTo(results[0].route, new Event('click'));
        }
      });
    }
    this.hideResults();
  }

  hideResults() {
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}