import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  weight: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  deliveryAddress: {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  orderDate: Date;
  deliveryDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  // Mock orders data for development
  private mockOrders: Order[] = [
    {
      id: 'ORD001',
      userId: '1',
      items: [
        {
          id: 'PROD001',
          name: 'Chicken Curry Cut',
          image: 'assets/images/chicken-curry-cut.jpg',
          quantity: 2,
          price: 180,
          weight: '500g'
        },
        {
          id: 'PROD002',
          name: 'Goat Curry Cut',
          image: 'assets/images/goat-curry-cut.jpg',
          quantity: 1,
          price: 400,
          weight: '500g'
        }
      ],
      total: 760,
      status: 'delivered',
      paymentMethod: 'Cash on Delivery',
      deliveryAddress: {
        fullName: 'Test User',
        phoneNumber: '1234567890',
        addressLine1: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456'
      },
      orderDate: new Date('2024-02-15'),
      deliveryDate: new Date('2024-02-16')
    }
  ];

  constructor() {}

  // Get all orders for a user
  getUserOrders(userId: string): Observable<Order[]> {
    const userOrders = this.mockOrders.filter(order => order.userId === userId);
    return of(userOrders).pipe(delay(500));
  }

  // Get a specific order by ID
  getOrderById(orderId: string): Observable<Order | undefined> {
    const order = this.mockOrders.find(order => order.id === orderId);
    return of(order).pipe(delay(500));
  }

  // Place a new order
  placeOrder(userId: string, items: OrderItem[], total: number, deliveryAddress: any, paymentMethod: string): Observable<Order> {
    const newOrder: Order = {
      id: `ORD${this.mockOrders.length + 1}`.padStart(6, '0'),
      userId,
      items,
      total,
      status: 'pending',
      paymentMethod,
      deliveryAddress,
      orderDate: new Date()
    };

    this.mockOrders.push(newOrder);
    return of(newOrder).pipe(delay(500));
  }

  // Cancel an order
  cancelOrder(orderId: string): Observable<Order | undefined> {
    const order = this.mockOrders.find(order => order.id === orderId);
    if (order && order.status === 'pending') {
      order.status = 'cancelled';
      return of(order).pipe(delay(500));
    }
    return of(undefined).pipe(delay(500));
  }

  // Track order status
  trackOrder(orderId: string): Observable<{ status: string; updates: Array<{ date: Date; status: string; message: string }> }> {
    const order = this.mockOrders.find(order => order.id === orderId);
    if (!order) return of({ status: 'not-found', updates: [] });

    const updates = [
      {
        date: order.orderDate,
        status: 'ordered',
        message: 'Order placed successfully'
      }
    ];

    if (order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') {
      updates.push({
        date: new Date(order.orderDate.getTime() + 1000 * 60 * 30),
        status: 'processing',
        message: 'Order confirmed and being processed'
      });
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      updates.push({
        date: new Date(order.orderDate.getTime() + 1000 * 60 * 60),
        status: 'shipped',
        message: 'Order has been shipped'
      });
    }

    if (order.status === 'delivered' && order.deliveryDate) {
      updates.push({
        date: order.deliveryDate,
        status: 'delivered',
        message: 'Order has been delivered'
      });
    }

    if (order.status === 'cancelled') {
      updates.push({
        date: new Date(order.orderDate.getTime() + 1000 * 60 * 10),
        status: 'cancelled',
        message: 'Order has been cancelled'
      });
    }

    return of({
      status: order.status,
      updates
    }).pipe(delay(500));
  }
} 