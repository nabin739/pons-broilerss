import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight: string;
  image: string;
  isCombo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'cartItems';
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);

  constructor() {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem(this.cartKey);
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartItemsSubject.next(this.cartItems);
    }
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItemsSubject.asObservable();
  }

  addToCart(item: CartItem) {
    const existingItem = this.cartItems.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.cartItems.push({...item});
    }

    this.updateCart();
  }

  removeFromCart(itemId: string) {
    const existingItem = this.cartItems.find(item => item.id === itemId);
    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      } else {
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
      }
      this.updateCart();
    }
  }

  removeItemCompletely(itemId: string) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.updateCart();
  }

  updateQuantity(itemId: string, quantity: number) {
    const item = this.cartItems.find(i => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      this.updateCart();
    }
  }

  clearCart() {
    this.cartItems = [];
    this.updateCart();
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartItemsCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  private updateCart() {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
    this.cartItemsSubject.next([...this.cartItems]);
  }
} 