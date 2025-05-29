import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrdersService, Order } from '../../services/orders.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container my-5">
      <h1 class="mb-4">My Orders</h1>

      <div *ngIf="orders.length > 0; else noOrders">
        <div class="card mb-4" *ngFor="let order of orders">
          <div class="card-header d-flex justify-content-between align-items-center">
            <div>
              <h5 class="mb-0">Order #{{ order.id }}</h5>
              <small class="text-muted">Placed on {{ order.orderDate | date:'medium' }}</small>
            </div>
            <span [class]="'badge ' + getStatusBadgeClass(order.status)">
              {{ order.status | titlecase }}
            </span>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-8">
                <div class="mb-3" *ngFor="let item of order.items">
                  <div class="d-flex align-items-center">
                    <img [src]="item.image" [alt]="item.name" class="me-3" style="width: 60px; height: 60px; object-fit: cover;">
                    <div>
                      <h6 class="mb-0">{{ item.name }}</h6>
                      <small class="text-muted">
                        {{ item.quantity }} x {{ item.weight }} - ₹{{ item.price }}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-4 border-start">
                <h6>Order Summary</h6>
                <p class="mb-1">Total Amount: ₹{{ order.total }}</p>
                <p class="mb-1">Payment Method: {{ order.paymentMethod }}</p>
                <div class="mt-3">
                  <button class="btn btn-outline-primary btn-sm me-2" (click)="trackOrder(order.id)">
                    Track Order
                  </button>
                  <button *ngIf="order.status === 'pending'" 
                          class="btn btn-outline-danger btn-sm"
                          (click)="cancelOrder(order.id)">
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>

            <!-- Order Tracking Modal -->
            <div *ngIf="selectedOrderTracking && selectedOrderId === order.id" class="mt-4">
              <h6>Order Tracking</h6>
              <div class="timeline">
                <div *ngFor="let update of selectedOrderTracking.updates" 
                     class="timeline-item"
                     [class.active]="update.status === selectedOrderTracking.status">
                  <div class="timeline-badge"></div>
                  <div class="timeline-content">
                    <p class="mb-1">{{ update.message }}</p>
                    <small class="text-muted">{{ update.date | date:'medium' }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noOrders>
        <div class="text-center py-5">
          <i class="bi bi-box-seam display-1 text-muted"></i>
          <h3 class="mt-3">No Orders Yet</h3>
          <p class="text-muted">Looks like you haven't placed any orders yet.</p>
          <a routerLink="/" class="btn btn-primary">Start Shopping</a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .timeline {
      position: relative;
      padding: 20px 0;
    }

    .timeline-item {
      position: relative;
      padding-left: 40px;
      margin-bottom: 20px;
    }

    .timeline-badge {
      position: absolute;
      left: 0;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #e9ecef;
      border: 3px solid #fff;
      box-shadow: 0 0 0 1px #dee2e6;
    }

    .timeline-item.active .timeline-badge {
      background-color: #28a745;
    }

    .timeline-item::before {
      content: '';
      position: absolute;
      left: 9px;
      top: 20px;
      bottom: -20px;
      width: 2px;
      background-color: #dee2e6;
    }

    .timeline-item:last-child::before {
      display: none;
    }

    .timeline-content {
      padding: 10px 15px;
      background-color: #f8f9fa;
      border-radius: 4px;
    }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  selectedOrderId: string | null = null;
  selectedOrderTracking: { status: string; updates: Array<{ date: Date; status: string; message: string }> } | null = null;

  constructor(
    private ordersService: OrdersService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.ordersService.getUserOrders(currentUser.id).subscribe(orders => {
        this.orders = orders;
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'bg-warning',
      'processing': 'bg-info',
      'shipped': 'bg-primary',
      'delivered': 'bg-success',
      'cancelled': 'bg-danger'
    };
    return statusClasses[status] || 'bg-secondary';
  }

  trackOrder(orderId: string) {
    if (this.selectedOrderId === orderId) {
      this.selectedOrderId = null;
      this.selectedOrderTracking = null;
    } else {
      this.selectedOrderId = orderId;
      this.ordersService.trackOrder(orderId).subscribe(tracking => {
        this.selectedOrderTracking = tracking;
      });
    }
  }

  cancelOrder(orderId: string) {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.ordersService.cancelOrder(orderId).subscribe(updatedOrder => {
        if (updatedOrder) {
          this.orders = this.orders.map(order => 
            order.id === orderId ? updatedOrder : order
          );
        }
      });
    }
  }
} 