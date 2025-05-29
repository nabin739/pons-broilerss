import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';

interface ChickenProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  variants: {
    weight: string;
    price: number;
  }[];
  category: string;
  quantity: number;
  selectedVariant?: {
    weight: string;
    price: number;
  };
}

@Component({
  selector: 'app-chicken',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container my-5">
      <h1 class="mb-4">Fresh Chicken</h1>
      
      <!-- Categories -->
      <div class="category-tabs mb-4">
        <button 
          *ngFor="let cat of categories" 
          class="btn"
          [class.btn-brown]="selectedCategory === cat"
          [class.btn-outline-brown]="selectedCategory !== cat"
          (click)="selectedCategory = cat">
          {{ cat }}
        </button>
      </div>

      <div class="product-grid">
        <div class="product-item" *ngFor="let product of filteredProducts">
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
    .category-tabs {
      display: flex;
      gap: 1rem;
      overflow-x: auto;
      padding-bottom: 1rem;
      margin-bottom: 2rem;
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

    @media (max-width: 768px) {
      .category-tabs {
        flex-wrap: nowrap;
        -webkit-overflow-scrolling: touch;
      }

      .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 16px;
        padding: 4px;
      }
    }
  `]
})
export class ChickenComponent {
  selectedCategory = 'All';

  categories = [
    'All',
    'Curry Cut',
    'Boneless',
    'Special Cuts',
    'Grill/Tandoori',
    'Offal'
  ];

  products: ChickenProduct[] = [
    {
      id: 'CC001',
      name: 'Chicken Curry Cut with Skin',
      description: 'Traditional curry cut pieces with skin, perfect for curries and biryanis',
      image: 'assets/images/cws.jpeg',
      variants: [
        { weight: '1 kg', price: 170 },
        { weight: '500 g', price: 85 }
      ],
      category: 'Curry Cut',
      quantity: 0
    },
    {
      id: 'CC002',
      name: 'Chicken Curry Cut without Skin',
      description: 'Skinless curry cut pieces, ideal for healthier preparations',
      image: 'assets/images/cwos.png',
      variants: [
        { weight: '1 kg', price: 220 },
        { weight: '500 g', price: 110 }
      ],
      category: 'Curry Cut',
      quantity: 0
    },
    {
      id: 'BL001',
      name: 'Chicken Boneless Curry Cut',
      description: 'Boneless pieces perfect for quick cooking and curries',
      image: 'assets/images/cbbl.webp',
      variants: [
        { weight: '1 kg', price: 350 },
        { weight: '500 g', price: 175 }
      ],
      category: 'Boneless',
      quantity: 0
    },
    {
      id: 'BL002',
      name: 'Chicken Breast Boneless',
      description: 'Premium chicken breast cuts, ideal for grilling and high-protein meals',
      image: 'assets/images/cbl.jpg',
      variants: [
        { weight: '1 kg', price: 350 },
        { weight: '500 g', price: 175 }
      ],
      category: 'Boneless',
      quantity: 0
    },
    {
      id: 'SP001',
      name: 'Chicken Wings with Skin',
      description: 'Juicy wings perfect for frying or grilling',
      image: 'assets/images/cw.jpg',
      variants: [
        { weight: '500 g', price: 100 }
      ],
      category: 'Special Cuts',
      quantity: 0
    },
    {
      id: 'SP002',
      name: 'Chicken Lollipop without Skin',
      description: 'Ready-to-cook lollipops, great for starters',
      image: 'assets/images/cl.png',
      variants: [
        { weight: '500 g', price: 125 }
      ],
      category: 'Special Cuts',
      quantity: 0
    },
    {
      id: 'SP003',
      name: 'Chicken Drumstick with Skin',
      description: 'Juicy drumsticks, perfect for grilling and frying',
      image: 'assets/images/cd.jpg',
      variants: [
        { weight: '500 g', price: 125 }
      ],
      category: 'Special Cuts',
      quantity: 0
    },
    {
      id: 'GR001',
      name: 'Chicken Grill/Tandoori Pack with Skin',
      description: 'Whole bird with skin, perfect for grilling or tandoori',
      image: 'assets/images/t1.jpg',
      variants: [
        { weight: 'Whole Bird', price: 220 }
      ],
      category: 'Grill/Tandoori',
      quantity: 0
    },
    {
      id: 'GR002',
      name: 'Chicken Grill/Tandoori Pack without Skin',
      description: 'Skinless whole bird for healthier grilling options',
      image: 'assets/images/t2.jfif',
      variants: [
        { weight: 'Whole Bird', price: 250 }
      ],
      category: 'Grill/Tandoori',
      quantity: 0
    },
    {
      id: 'OF001',
      name: 'Chicken Liver',
      description: 'Fresh chicken liver, rich in nutrients',
      image: 'assets/images/cli.jpg',
      variants: [
        { weight: '1 kg', price: 200 },
        { weight: '500 g', price: 100 }
      ],
      category: 'Offal',
      quantity: 0
    },
    {
      id: 'OF002',
      name: 'Chicken Gizzard',
      description: 'Clean chicken gizzard, ready to cook',
      image: 'assets/images/cg.jpg',
      variants: [
        { weight: '1 kg', price: 200 },
        { weight: '500 g', price: 100 }
      ],
      category: 'Offal',
      quantity: 0
    },
    {
      id: 'SP004',
      name: 'Chicken Kothu Curry',
      description: 'Special cut pieces for kothu preparations',
      image: 'assets/images/ck.webp',
      variants: [
        { weight: '1 kg', price: 350 },
        { weight: '500 g', price: 175 }
      ],
      category: 'Special Cuts',
      quantity: 0
    },
    {
      id: 'SP005',
      name: 'Chicken Bone',
      description: 'Chicken bones for making stock and soups',
      image: 'assets/images/cb.webp',
      variants: [
        { weight: '1 kg', price: 70 }
      ],
      category: 'Special Cuts',
      quantity: 0
    }
  ];

  constructor(private cartService: CartService) {}

  get filteredProducts() {
    if (this.selectedCategory === 'All') {
      return this.products;
    }
    return this.products.filter(product => product.category === this.selectedCategory);
  }

  addToCart(product: ChickenProduct, variant: { weight: string; price: number }) {
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

  increaseQuantity(product: ChickenProduct, variant: { weight: string; price: number }) {
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

  decreaseQuantity(product: ChickenProduct) {
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