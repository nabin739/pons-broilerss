import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { BlinkingPosterComponent } from '../blinking-poster/blinking-poster.component';

interface Category {
  name: string;
  image: string;
  route: string;
  description: string;
}

interface ComboPack {
  name: string;
  items: string[];
  weight: string;
  price: number;
  image: string;
  quantity?: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, BlinkingPosterComponent],
  template: `
    <div class="home-container">
      <!-- Carousel Section -->
      <div class="carousel-section">
        <div class="carousel-container">
        <div class="carousel">
            <div class="carousel-inner" [style.transform]="'translateX(-' + (currentSlide * 100) + '%)'">
              <div class="carousel-item" *ngFor="let item of carouselItems">
            <div class="carousel-content">
                  <div class="content-wrapper">
              <h2>{{ item.title }}</h2>
                    <h3>{{ item.subtitle }}</h3>
                  </div>
                </div>
              </div>
            </div>
            <button class="carousel-control prev" (click)="prevSlide()">
              <i class="bi bi-chevron-left"></i>
            </button>
            <button class="carousel-control next" (click)="nextSlide()">
              <i class="bi bi-chevron-right"></i>
            </button>
          <div class="carousel-indicators">
            <button *ngFor="let item of carouselItems; let i = index" 
                    [class.active]="i === currentSlide"
                    (click)="goToSlide(i)">
            </button>
          </div>
        </div>
          <app-blinking-poster class="carousel-posters"></app-blinking-poster>
        </div>
      </div>

      <!-- Categories Section -->
      <section class="categories-section">
        <div class="container">
          <h2 class="section-title">Our Categories</h2>
          <div class="categories-grid">
            <a [routerLink]="category.route" class="category-card" *ngFor="let category of mainCategories">
            <div class="category-image">
              <img [src]="category.image" [alt]="category.name">
            </div>
            <h3>{{ category.name }}</h3>
            </a>
          </div>
        </div>
      </section>

      <!-- Combo Packs Section -->
      <section class="combo-packs-section">
        <div class="container">
          <h2 class="section-title">Special Combo Packs</h2>
          <div class="combo-packs-grid">
            <div class="combo-pack-card" *ngFor="let pack of comboPacks">
              <div class="combo-image">
                <img [src]="pack.image" [alt]="pack.name">
                <div class="combo-badge">COMBO</div>
              </div>
              <div class="combo-info">
                <h3>{{ pack.name }}</h3>
                <ul class="combo-items">
                  <li *ngFor="let item of pack.items">{{ item }}</li>
                </ul>
                <div class="combo-details">
                  <span class="weight">{{ pack.weight }}</span>
                  <span class="price">₹{{ pack.price }}</span>
                </div>
                <div class="quantity-controls" *ngIf="pack.quantity && pack.quantity > 0">
                  <button class="qty-btn" (click)="decreaseComboQuantity(pack)">-</button>
                  <span class="qty-display">{{ pack.quantity }}</span>
                  <button class="qty-btn" (click)="increaseComboQuantity(pack)">+</button>
                </div>
                <button class="btn-add-cart" *ngIf="!pack.quantity || pack.quantity === 0" 
                        (click)="addComboToCart(pack)">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      padding-top: 0;
    }

    /* Carousel Styles */
    .carousel-section {
      position: relative;
      background: #fff1f4;
      padding: 20px 0;
      margin-bottom: 40px;
    }

    .carousel-container {
      position: relative;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      gap: 15px;
    }

    .carousel {
      position: relative;
      overflow: hidden;
      width: 85%;
      height: 200px;
      border-radius: 8px;
      background: #fff1f4;
    }

    .carousel-inner {
      display: flex;
      transition: transform 0.5s ease-in-out;
      height: 100%;
    }

    .carousel-item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      height: 100%;
      text-align: center;
    }

    .carousel-item img {
      height: 100%;
      width: auto;
      object-fit: contain;
      margin-right: 0;
    }

    .carousel-content {
      width: 100%;
      text-align: center;
    }

    .content-wrapper {
      max-width: 800px;
      margin: 0 auto;
    }

    .carousel-content h2 {
      color: #E31837;
      font-size: 2rem;
      margin-bottom: 10px;
      font-weight: bold;
    }

    .carousel-content h3 {
      color: #333;
      font-size: 1.5rem;
      margin: 0;
    }

    .carousel-control {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: #E31837;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      color: white;
      transition: all 0.3s ease;
      z-index: 2;
    }

    .carousel-control:hover {
      background: #c41530;
    }

    .carousel-control.prev {
      left: 5px;
    }

    .carousel-control.next {
      right: 5px;
    }

    .carousel-indicators {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 6px;
      z-index: 2;
    }

    .carousel-indicators button {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      border: none;
      background: rgba(227, 24, 55, 0.5);
      cursor: pointer;
      padding: 0;
      transition: all 0.3s ease;
    }

    .carousel-indicators button.active {
      background: #E31837;
      transform: scale(1.2);
    }

    .carousel-posters {
      width: 15%;
      align-self: flex-start;
    }

    /* Categories Styles */
    .categories-section {
      padding: 40px 0;
      background: #fff;
    }

    .section-title {
      text-align: center;
      margin-bottom: 40px;
      color: #333;
      font-size: 2rem;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
      padding: 0 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .category-card:nth-child(4),
    .category-card:nth-child(5) {
      transform: translateX(50%);
    }

    .category-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
      transition: transform 0.3s ease;
    }

    .category-card:hover {
      transform: translateY(-5px);
    }

    .category-card:nth-child(4):hover,
    .category-card:nth-child(5):hover {
      transform: translateX(50%) translateY(-5px);
    }

    .category-image {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 15px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      border: 3px solid #fff;
      transition: box-shadow 0.3s ease;
    }

    .category-card:hover .category-image {
      box-shadow: 0 6px 12px rgba(227, 24, 55, 0.2);
    }

    .category-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .category-card h3 {
      color: #333;
      font-size: 1.2rem;
      text-align: center;
      margin: 0;
      font-weight: 500;
    }

    @media (max-width: 992px) {
      .categories-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 25px;
      }

      .category-card:nth-child(4),
      .category-card:nth-child(5) {
        transform: none;
      }

      .category-card:nth-child(4):hover,
      .category-card:nth-child(5):hover {
        transform: translateY(-5px);
      }
    }

    @media (max-width: 768px) {
      .categories-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        padding: 0 15px;
      }

      .category-image {
        width: 140px;
        height: 140px;
      }

      .category-card h3 {
        font-size: 1.1rem;
      }
    }

    @media (max-width: 480px) {
      .category-image {
        width: 120px;
        height: 120px;
      }

      .category-card h3 {
        font-size: 1rem;
      }
    }

    /* Combo Packs Styles */
    .combo-packs-section {
      padding: 40px 0;
      background: #fff;
    }

    .combo-packs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 25px;
      padding: 0 20px;
    }

    .combo-pack-card {
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .combo-pack-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    }

    .combo-image {
      position: relative;
      height: 200px;
      overflow: hidden;
      }

    .combo-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .combo-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #E31837;
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: bold;
    }

    .combo-info {
      padding: 20px;
    }

    .combo-info h3 {
      color: #333;
      font-size: 1.2rem;
      margin: 0 0 10px;
      font-weight: bold;
    }

    .combo-items {
      list-style: none;
      padding: 0;
      margin: 0 0 15px;
      color: #666;
      font-size: 0.9rem;
    }

    .combo-items li {
      margin-bottom: 5px;
    }

    .combo-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      font-weight: 500;
      }

    .weight {
      color: #666;
      font-size: 0.9rem;
    }

    .price {
      color: #E31837;
      font-size: 1.3rem;
    }

    .btn-add-cart {
      width: 100%;
      background: #E31837;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 5px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .btn-add-cart:hover {
      background: #c41530;
    }

    @media (max-width: 768px) {
      .combo-packs-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        padding: 0 10px;
      }

      .combo-image {
        height: 150px;
      }

      .combo-info {
        padding: 15px;
      }

      .combo-info h3 {
        font-size: 1.1rem;
      }

      .price {
        font-size: 1.2rem;
      }
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 5px;
    }

    .qty-btn {
      background: #E31837;
      color: white;
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 4px;
      font-size: 1.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease;
    }

    .qty-btn:hover {
      background: #c41530;
    }

    .qty-display {
      font-size: 1.1rem;
      font-weight: 500;
      min-width: 30px;
      text-align: center;
    }
  `]
})
export class HomeComponent {
  currentSlide = 0;

  carouselItems = [
    {
      title: 'Entry Poster - 1',
      subtitle: 'Daily Offer'
    },
    {
      title: 'Entry Poster - 2',
      subtitle: 'Only on Sunday'
    },
    {
      title: 'Entry Poster - 3',
      subtitle: 'Daily'
    }
  ];

  mainCategories: Category[] = [
    {
      name: 'Chicken',
      image: 'assets/images/chicken.png',
      route: '/chicken',
      description: 'Fresh farm-raised chicken'
    },
    {
      name: 'Country Chicken',
      image: 'assets/images/country_chicken.jpg',
      route: '/country-chicken',
      description: 'Traditional free-range chicken'
    },
    {
      name: 'Japanese Quail',
      image: 'assets/images/quail.jpg',
      route: '/japanese-quail',
      description: 'Premium quality quail meat'
    },
    {
      name: 'Turkey Bird',
      image: 'assets/images/turkey.jpg',
      route: '/turkey',
      description: 'Fresh turkey meat'
    },
    {
      name: 'Goat',
      image: 'assets/images/goat.png',
      route: '/goat',
      description: 'Premium goat meat cuts'
    }
  ];

  comboPacks: ComboPack[] = [
    {
      name: 'Gym Protein Pack',
      items: ['Chicken Breast Boneless'],
      weight: '250g',
      price: 100,
      image: 'assets/images/Gym Pack.jpg',
      quantity: 0
    },
    {
      name: 'Pets Special Pack',
      items: ['Chicken Bone'],
      weight: '1kg',
      price: 70,
      image: 'assets/images/cb.webp',
      quantity: 0
    },
    {
      name: 'Liver Pack',
      items: ['Liver Frozen'],
      weight: '1kg',
      price: 90,
      image: 'assets/images/Chicken liver .jpg',
      quantity: 0
    },
    {
      name: 'Leg Pack',
      items: ['Chicken Leg'],
      weight: '1kg',
      price: 50,
      image: 'assets/images/Chicken leg piece with thigh .webp',
      quantity: 0
    }
  ];

  constructor(private cartService: CartService) {}

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? 
      this.carouselItems.length - 1 : this.currentSlide - 1;
  }

  nextSlide() {
    this.currentSlide = this.currentSlide === this.carouselItems.length - 1 ? 
      0 : this.currentSlide + 1;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  addComboToCart(pack: ComboPack) {
    pack.quantity = 1;
    this.cartService.addToCart({
      id: pack.name,
      name: pack.name,
      price: pack.price,
      quantity: 1,
      weight: pack.weight,
      image: pack.image,
      isCombo: true
    });
  }

  increaseComboQuantity(pack: ComboPack) {
    pack.quantity! += 1;
    this.cartService.addToCart({
      id: pack.name,
      name: pack.name,
      price: pack.price,
      quantity: 1,
      weight: pack.weight,
      image: pack.image,
      isCombo: true
    });
  }

  decreaseComboQuantity(pack: ComboPack) {
    if (pack.quantity! > 0) {
      pack.quantity! -= 1;
      this.cartService.removeFromCart(pack.name);
    }
  }
}