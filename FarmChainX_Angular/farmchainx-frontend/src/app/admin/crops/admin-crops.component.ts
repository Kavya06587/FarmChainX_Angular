import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-crops',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-crops.component.html'
})
export class AdminCropsComponent {

  crops: any[] = [];
  loading = true; // ✅ REQUIRED

  constructor(private http: HttpClient) {
    this.loadCrops();
  }

  loadCrops(): void {
    this.loading = true;

    this.http
      .get<any[]>('http://localhost:8080/api/admin/crops')
      .subscribe({
        next: (res) => {
          this.crops = res || [];
        },
        error: (err) => {
          console.error('Failed to load crops', err);
          this.crops = [];
        },
        complete: () => {
          this.loading = false; // ✅ IMPORTANT
        }
      });
  }

  deleteCrop(id: number): void {
    if (!confirm('Are you sure you want to delete this crop?')) return;

    this.http
      .delete(`http://localhost:8080/api/crops/delete/${id}`)
      .subscribe(() => this.loadCrops());
  }
}
