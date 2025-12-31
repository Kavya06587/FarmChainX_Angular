import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './marketplace.component.html',
})
export class MarketplaceComponent implements OnInit {

  products: any[] = [];
  loading = true;

  // filters
  search = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy = '';

  selectedProduct: any = null;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef   // ✅ ADD THIS
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  /* ---------------- FETCH PRODUCTS ---------------- */
  fetchProducts(): void {
    this.loading = true;

    this.http.get<any[]>('http://localhost:8080/api/listings/')
      .subscribe({
        next: (res) => {
          this.products = (res || [])
            .filter(p => p.status === 'ACTIVE')
            .map(p => ({
              listingId: p.listingId,
              cropName: p.cropName,
              farmerId: p.farmerId,
              batchId: p.batchId,
              price: Number(p.price),
              quantity: Number(p.quantity),
              qualityGrade: p.qualityGrade || 'Not Graded',
              traceUrl: p.traceUrl,
              cropImageUrl: p.cropImageUrl
            }));

          // ✅ FORCE UI UPDATE
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Marketplace fetch failed', err);
          this.products = [];
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  /* ---------------- IMAGE HANDLING ---------------- */
  getImageUrl(path: string | null): string {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;
    return `http://localhost:8080${path}`;
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = '/placeholder.png';
  }

  /* ---------------- TRACE ---------------- */
  openTrace(url: string) {
    window.open(url, '_blank');
  }

  /* ---------------- BUY NOW ---------------- */
  buyNow(product: any) {
    const role = localStorage.getItem('userRole');
    if (role !== 'BUYER') {
      alert('Please login as a buyer');
      return;
    }
    this.selectedProduct = product;
  }

  /* ---------------- FILTER + SORT ---------------- */
  get filteredProducts(): any[] {
    return this.products
      .filter(p =>
        p.cropName.toLowerCase().includes(this.search.toLowerCase())
      )
      .filter(p => this.minPrice !== null ? p.price >= this.minPrice : true)
      .filter(p => this.maxPrice !== null ? p.price <= this.maxPrice : true)
      .sort((a, b) => {
        if (this.sortBy === 'PRICE_ASC') return a.price - b.price;
        if (this.sortBy === 'PRICE_DESC') return b.price - a.price;
        if (this.sortBy === 'QTY_ASC') return a.quantity - b.quantity;
        if (this.sortBy === 'QTY_DESC') return b.quantity - a.quantity;
        return 0;
      });
  }
}
