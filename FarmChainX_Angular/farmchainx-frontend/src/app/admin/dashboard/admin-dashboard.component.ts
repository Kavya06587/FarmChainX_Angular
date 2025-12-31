// src/app/admin/dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { SupportService } from '../../core/services/support.service';

interface User {
  id: string;
  name?: string;
  fullName?: string;
  email: string;
  role: string;
  blocked: boolean;
}

interface Crop {
  cropId: string;
  cropName: string;
  cropType: string;
  quantity: number;
  price: number;
  status: string;
  batchId: string;
}

interface Stats {
  farmers: number;
  distributors: number;
  consumers: number;
  admins: number;
  tickets: number;
  totalUsers: number;
  activeCrops: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  crops: Crop[] = [];
  filteredCrops: Crop[] = [];
  stats: Stats = {
    farmers: 0,
    distributors: 0,
    consumers: 0,
    admins: 0,
    tickets: 0,
    totalUsers: 0,
    activeCrops: 0
  };

  search: string = '';
  cropSearch: string = '';
  statusFilter: string = 'ALL';
  roleFilter: string = 'ALL';

  activeTab: string = 'USERS';
  selectedRow: User | null = null;
  showDetails: boolean = false;
  pendingRoleChange: { user: User; role: string } | null = null;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private supportService: SupportService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  logoutAdmin(): void {
    localStorage.removeItem('admin');
    this.router.navigate(['/admin/login']);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  async loadData(): Promise<void> {
    try {
      // Load stats
      const statsRes: any = await this.apiService.getStats().toPromise();
      
      // Load users
      const [farmers, distributors, consumers, admins] = await Promise.all([
        this.apiService.getFarmers().toPromise(),
        this.apiService.getDistributors().toPromise(),
        this.apiService.getConsumers().toPromise(),
        this.apiService.getAdmins().toPromise()
      ]);

      // Load crops
      const cropsRes: any = await this.apiService.getCrops().toPromise();

      // Load ticket stats
      let ticketCount = 0;
      try {
        const ticketsStats: any = await this.supportService.getSupportStats().toPromise();
        ticketCount = ticketsStats?.data?.totalTickets || ticketsStats?.totalTickets || 0;
      } catch {
        try {
          const ticketsRes: any = await this.supportService.getAllTickets().toPromise();
          if (Array.isArray(ticketsRes)) {
            ticketCount = ticketsRes.length;
          } else if (Array.isArray(ticketsRes?.data)) {
            ticketCount = ticketsRes.data.length;
          } else if (Array.isArray(ticketsRes?.data?.tickets)) {
            ticketCount = ticketsRes.data.tickets.length;
          }
        } catch (error) {
          console.error('Error loading ticket count:', error);
        }
      }

      // Combine users
      const allUsers = [
        ...(farmers || []),
        ...(distributors || []),
        ...(consumers || []),
        ...(admins || [])
      ].map((u: any) => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
      });

      this.stats = { 
        farmers: statsRes?.farmers || 0,
        distributors: statsRes?.distributors || 0,
        consumers: statsRes?.consumers || 0,
        admins: statsRes?.admins || 0,
        tickets: ticketCount,
        totalUsers: allUsers.length,
        activeCrops: (cropsRes || []).length
      };
      
      this.users = allUsers;
      this.crops = cropsRes || [];
      this.filteredCrops = cropsRes || [];
    } catch (err) {
      console.error('Admin dashboard load error:', err);
    }
  }

  filterCrops(): void {
    if (!this.cropSearch.trim()) {
      this.filteredCrops = this.crops;
      return;
    }

    const term = this.cropSearch.toLowerCase();
    this.filteredCrops = this.crops.filter(c =>
      (c.cropName?.toLowerCase() || '').includes(term) ||
      (c.cropType?.toLowerCase() || '').includes(term) ||
      (c.batchId?.toLowerCase() || '').includes(term) ||
      (c.status?.toLowerCase() || '').includes(term)
    );
  }

  async blockUser(id: string): Promise<void> {
    await this.apiService.blockUser(id).toPromise();
    this.loadData();
  }

  async unblockUser(id: string): Promise<void> {
    await this.apiService.unblockUser(id).toPromise();
    this.loadData();
  }

  async confirmRoleChange(): Promise<void> {
    if (!this.pendingRoleChange) return;
    
    await this.apiService.updateUserRole(
      this.pendingRoleChange.user.id,
      this.pendingRoleChange.role
    ).toPromise();
    
    this.pendingRoleChange = null;
    this.loadData();
  }

  async deleteCrop(id: string): Promise<void> {
    if (!confirm('Delete this crop permanently?')) return;
    await this.apiService.deleteCrop(id).toPromise();
    this.loadData();
  }

  get filteredUsers(): User[] {
    return this.users
      .filter(u => JSON.stringify(u).toLowerCase().includes(this.search.toLowerCase()))
      .filter(u =>
        this.statusFilter === 'ALL' ||
        (this.statusFilter === 'ACTIVE' && !u.blocked) ||
        (this.statusFilter === 'INACTIVE' && u.blocked)
      )
      .filter(u => this.roleFilter === 'ALL' || u.role === this.roleFilter);
  }

  getBadgeClass(color: string): string {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-700';
      case 'red': return 'bg-red-100 text-red-700';
      case 'blue': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}