import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent {

  users: any[] = [];

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<any[]>('http://localhost:8080/api/admin/users')
      .subscribe(res => this.users = res || []);
  }

  block(id: number) {
    this.http.put(`http://localhost:8080/api/admin/block/${id}`, {})
      .subscribe(() => this.loadUsers());
  }

  unblock(id: number) {
    this.http.put(`http://localhost:8080/api/admin/unblock/${id}`, {})
      .subscribe(() => this.loadUsers());
  }
}
