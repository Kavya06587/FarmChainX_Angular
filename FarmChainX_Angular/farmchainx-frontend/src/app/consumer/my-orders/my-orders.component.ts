import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

const API = 'http://localhost:8080';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  templateUrl: './my-orders.component.html',
  imports: [CommonModule]
})
export class MyOrdersComponent implements OnInit {

  user: any;
  orders: any[] = [];
  loading = true;

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef   // ✅ ADD THIS
  ) {}

  ngOnInit(): void {
    this.user = this.auth.user;
    this.fetchOrders();
  }

  fetchOrders() {
    if (!this.user?.id) return;

    this.loading = true;

    this.http
      .get<any[]>(`${API}/api/orders/consumer/${this.user.id}/full`)
      .subscribe({
        next: (res) => {
          this.orders = res || [];
          this.loading = false;

          // ✅ FORCE VIEW UPDATE
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Order fetch failed', err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  cancelOrder(orderId: number) {
    const reason = prompt('Reason for cancellation');
    if (!reason) return;

    this.http
      .put(`${API}/api/orders/${orderId}/cancel`, { cancelReason: reason })
      .subscribe(() => this.fetchOrders());
  }
}
