// src/app/admin/reports/admin-reports.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-reports.component.html'
})
export class AdminReportsComponent implements OnInit {
  stats: any = null;
  crops: any[] = [];
  chartDataLoaded = false;

  userData: any[] = [];
  cropChartData: any[] = [];

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  async loadData(): Promise<void> {
    try {
      const [statsRes, cropsRes] = await Promise.all([
        this.apiService.getStats().toPromise(),
        this.apiService.getCrops().toPromise()
      ]);

      this.stats = statsRes || {};
      this.crops = cropsRes || [];

      this.prepareChartData();
    } catch (err) {
      console.error('Error loading reports:', err);
    }
  }

  prepareChartData(): void {
    // User distribution data
    if (this.stats) {
      this.userData = [
        { name: 'Farmers', value: this.stats.farmers || 0 },
        { name: 'Distributors', value: this.stats.distributors || 0 },
        { name: 'Consumers', value: this.stats.consumers || 0 },
        { name: 'Admins', value: this.stats.admins || 0 }
      ];
    }

    // Crop distribution data
    const cropCountMap: { [key: string]: number } = {};
    this.crops.forEach((crop: any) => {
      if (crop.cropName) {
        cropCountMap[crop.cropName] = (cropCountMap[crop.cropName] || 0) + 1;
      }
    });

    this.cropChartData = Object.entries(cropCountMap).map(
      ([name, count]) => ({ name, value: count, count })
    );

    this.chartDataLoaded = true;
  }

  logout(): void {
    localStorage.removeItem('admin');
    this.router.navigate(['/admin/login']);
  }

  getChartColors(index: number): string {
    const COLORS = ["#6366f1", "#22c55e", "#a855f7", "#ef4444", "#f97316", "#14b8a6"];
    return COLORS[index % COLORS.length];
  }

  formatNumber(num: number): string {
    return num.toLocaleString();
  }

  // Helper method to get max value from array
  getMaxValue(data: any[]): number {
    if (data.length === 0) return 1;
    const max = Math.max(...data.map(d => d.value || d.count || 0));
    return max > 0 ? max : 1;
  }

  // Calculate bar height percentage
  getBarHeight(itemValue: number, data: any[]): string {
    const max = this.getMaxValue(data);
    return ((itemValue / max) * 80) + '%';
  }
}