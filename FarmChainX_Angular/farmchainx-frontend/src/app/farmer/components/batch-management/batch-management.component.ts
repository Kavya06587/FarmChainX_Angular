import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TracePreviewComponent } from '../trace-preview/trace-preview.component';

@Component({
  selector: 'app-batch-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TracePreviewComponent],
  templateUrl: './batch-management.component.html'
})
export class BatchManagementComponent implements OnInit {

  @Input() user!: any;
  @Output() close = new EventEmitter<void>();

  apiBase = 'http://localhost:8080/api/batches';

  STATUS_OPTIONS = [
    'PLANTED',
    'GROWING',
    'READY_FOR_HARVEST',
    'HARVESTED',
    'LISTED',
    'SOLD'
  ];

  QUALITY_OPTIONS = ['A', 'B', 'C'];

  batches: any[] = [];
  batchCrops: Record<string, any[]> = {};
  expandedBatchId: string | null = null;

  loading = false;
  loadingRow: string | null = null;
  processingHarvest = false;
  error = '';

  statusUpdate: Record<string, string> = {};
  qualityUpdate: Record<string, { grade?: string; confidence?: number }> = {};
  mergeTarget: Record<string, string> = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchBatches();
  }

  /* ---------------- FETCH ---------------- */

  fetchBatches(): void {
    if (!this.user?.id) return;

    this.loading = true;
    this.error = '';

    const url =
      this.user.role === 'FARMER'
        ? `${this.apiBase}/farmer/${this.user.id}`
        : `${this.apiBase}/pending`;

    this.http.get<any[]>(url).subscribe({
      next: res => this.batches = res || [],
      error: () => this.error = 'Failed to load batches.',
      complete: () => this.loading = false
    });
  }

  fetchCropsForBatch(batchId: string): void {
    this.loadingRow = batchId;

    this.http.get<any[]>(`${this.apiBase}/${batchId}/crops`).subscribe({
      next: res => this.batchCrops[batchId] = res || [],
      error: () => this.error = 'Failed to load crops.',
      complete: () => this.loadingRow = null
    });
  }

  /* ---------------- UI ---------------- */

  toggleExpand(batchId: string): void {
    if (this.expandedBatchId === batchId) {
      this.expandedBatchId = null;
      return;
    }

    this.expandedBatchId = batchId;

    if (!this.batchCrops[batchId]) {
      this.fetchCropsForBatch(batchId);
    }
  }

  /* ---------------- STATUS ---------------- */

  applyStatusUpdate(batchId: string): void {
    const status = this.statusUpdate[batchId];
    if (!status) return alert('Select status');

    this.loadingRow = batchId;

    this.http.put(`${this.apiBase}/${batchId}/status`, {
      status,
      userId: this.user.id
    }).subscribe({
      next: () => {
        this.batches = this.batches.map(b =>
          b.batchId === batchId ? { ...b, status } : b
        );
        alert('Status updated');
      },
      error: () => alert('Status update failed'),
      complete: () => this.loadingRow = null
    });
  }

  /* ---------------- QUALITY ---------------- */

  applyQualityUpdate(batchId: string): void {
    const q = this.qualityUpdate[batchId];
    if (!q?.grade) return alert('Select grade');

    this.loadingRow = batchId;

    this.http.put(`${this.apiBase}/${batchId}/status`, {
      status: 'QUALITY_UPDATED',
      userId: this.user.id,
      qualityGrade: q.grade,
      confidence: q.confidence ?? null
    }).subscribe({
      next: () => alert('Quality updated'),
      error: () => alert('Quality update failed'),
      complete: () => this.loadingRow = null
    });
  }

  /* ---------------- SPLIT / MERGE ---------------- */

  splitBatch(batchId: string): void {
    const qty = prompt('Enter quantity to split');
    if (!qty) return;

    this.loadingRow = batchId;

    this.http.post(`${this.apiBase}/${batchId}/split`, {
      quantity: Number(qty),
      userId: this.user.id
    }).subscribe({
      next: () => this.fetchBatches(),
      error: () => alert('Split failed'),
      complete: () => this.loadingRow = null
    });
  }

  mergeBatch(sourceId: string): void {
    const targetId = this.mergeTarget[sourceId];
    if (!targetId || targetId === sourceId) return;

    this.loadingRow = sourceId;

    this.http.post(`${this.apiBase}/merge/${targetId}`, {
      sourceBatchIds: [sourceId],
      userId: this.user.id
    }).subscribe({
      next: () => this.fetchBatches(),
      error: () => alert('Merge failed'),
      complete: () => this.loadingRow = null
    });
  }

  /* ---------------- DISTRIBUTOR ---------------- */

  approveBatch(batchId: string): void {
    this.http.put(`${this.apiBase}/distributor/approve/${batchId}/${this.user.id}`, {})
      .subscribe(() => this.fetchBatches());
  }

  rejectBatch(batchId: string): void {
    this.http.put(`${this.apiBase}/distributor/reject/${batchId}/${this.user.id}`, {})
      .subscribe(() => this.fetchBatches());
  }

  /* ---------------- HARVEST ---------------- */

  processDailyHarvest(): void {
    if (!confirm('Process today’s harvest?')) return;

    this.processingHarvest = true;

    this.http.post(`${this.apiBase}/process-daily-harvest/${this.user.id}`, {})
      .subscribe({
        next: () => this.fetchBatches(),
        complete: () => this.processingHarvest = false
      });
  }

  getQrUrl(batch: any): string {
    return batch.qrCodeUrl || `${window.location.origin}/trace/${batch.batchId}`;
  }
}
