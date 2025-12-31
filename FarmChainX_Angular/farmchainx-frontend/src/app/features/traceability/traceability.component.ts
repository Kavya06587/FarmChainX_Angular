import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-traceability',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './traceability.component.html'
})
export class TraceabilityComponent implements OnInit {

  batchId!: string;

  trace: any[] = [];
  farmerId: string | null = null;
  cropName: string | null = null;
  distributorId: string | null = null;

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.batchId = this.route.snapshot.paramMap.get('batchId')!;
    this.fetchTrace();
  }

  fetchTrace(): void {
    this.loading = true;

    this.http
      .get<any>(`http://localhost:8080/api/batches/${this.batchId}/trace`)
      .subscribe({
        next: (res) => {
          this.farmerId = res.farmerId;
          this.cropName = res.cropType || 'Not Available';
          this.distributorId = res.distributorId || 'Not Assigned';
          this.trace = res.traces || [];
        },
        error: (err) => {
          console.error('Error fetching trace:', err);
          this.trace = [];
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  /* ---------------- HELPERS ---------------- */

  formatDateTime(isoDate: string): string {
    const date = new Date(isoDate);
    return date
      .toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
      .replace(',', ' ·');
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'planted': return 'bg-green-100 text-green-700';
      case 'growing': return 'bg-blue-100 text-blue-700';
      case 'ready_for_harvest': return 'bg-yellow-100 text-yellow-700';
      case 'harvested': return 'bg-green-200 text-green-800';
      case 'listed': return 'bg-purple-100 text-purple-700';
      case 'sold': return 'bg-gray-200 text-gray-700';
      default: return 'bg-gray-100 text-gray-500';
    }
  }

  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'planted': return '🌱';
      case 'growing': return '⏳';
      case 'ready_for_harvest': return '📦';
      case 'harvested': return '✅';
      case 'listed': return '📝';
      case 'sold': return '✔️';
      default: return '⏱️';
    }
  }
}
