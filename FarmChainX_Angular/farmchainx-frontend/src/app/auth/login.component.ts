import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  email = '';
  password = '';
  showPassword = false;
  loading = false;
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    if (!this.email || !this.password) {
      this.error = 'Email and password are required';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      const res = await this.auth.login(this.email, this.password);
      const role = res.user?.role;

      switch (role) {
        case 'FARMER':
          this.router.navigate(['/farmer']);
          break;
        case 'BUYER':
          this.router.navigate(['/consumer']);
          break;
        case 'DISTRIBUTOR':
          this.router.navigate(['/distributor']);
          break;
        case 'ADMIN':
          this.router.navigate(['/admin/dashboard']);
          break;
        default:
          this.router.navigate(['/']);
      }

    } catch (err: any) {
      this.error = err?.error?.message || 'Invalid email or password';
    } finally {
      this.loading = false;
    }
  }
}
