import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-trace-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trace-preview.component.html'
})
export class TracePreviewComponent implements OnChanges {

  @Input() batchId!: string;

  traces: any[] = [];
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['batchId'] && this.batchId) {
      this.loadTrace();
    }
  }

  private loadTrace(): void {
    this.loading = true;
    this.traces = [];

    this.http
      .get<any>(`http://localhost:8080/api/batches/${this.batchId}/trace`)
      .subscribe({
        next: res => (this.traces = res?.traces || []),
        error: () => (this.traces = []),
        complete: () => (this.loading = false)
      });
  }
}
