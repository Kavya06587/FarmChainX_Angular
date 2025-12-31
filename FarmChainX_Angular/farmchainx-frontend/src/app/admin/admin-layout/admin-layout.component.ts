import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('admin');
    this.router.navigate(['/login']);
  }
}
