import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-batch-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './batch-card.component.html'
})
export class BatchCardComponent {

  @Input() batch: any;
  @Input() readOnly = false;
@Output() approve = new EventEmitter<string>();
@Output() reject = new EventEmitter<string>();
@Output() trace = new EventEmitter<string>();



  get imageUrl(): string {
    if (!this.batch?.cropImageUrl) return '/placeholder.png';
    return `http://localhost:8080${encodeURI(this.batch.cropImageUrl)}`;
  }

  get isInvalid(): boolean {
    return (
      !this.batch ||
      this.batch.status === 'DELETED' ||
      this.batch.status === 'EMPTY'
    );
  }


onApprove() { this.approve.emit(this.batch.batchId); }
onReject() { this.reject.emit(this.batch.batchId); }
onTrace() { this.trace.emit(this.batch.batchId); }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = '/placeholder.png';
  }
}
