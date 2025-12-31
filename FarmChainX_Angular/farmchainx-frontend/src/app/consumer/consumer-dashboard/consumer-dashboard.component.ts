import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-consumer-dashboard',
  templateUrl: './consumer-dashboard.component.html',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LucideAngularModule
  ]
})
export class ConsumerDashboardComponent implements OnInit {

  user: any;
  showAIAssistant = false;

  constructor(
    private auth: AuthService,
    public router: Router  // Changed to public for template access
  ) {}

  ngOnInit(): void {
    this.user = this.auth.user;
    console.log('ConsumerDashboard initialized');
    console.log('Current user:', this.user);
    console.log('Current URL:', window.location.href);

    if (!this.user) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    if (this.user.role !== 'BUYER') {
      this.router.navigate(['/'], { replaceUrl: true });
    }
  }

  go(path: string) {
    console.log('Navigating to:', path);
    this.router.navigate([path]);
  }

  // Method to open AI Assistant page
  openAIAssistant() {
    console.log('=== AI Assistant Button Clicked ===');
    console.log('Current route:', this.router.url);
    console.log('Current full URL:', window.location.href);
    console.log('Attempting to navigate to /consumer/ai-assistant');
    
    // Try navigation with promise handling
    this.router.navigate(['/consumer/ai-assistant']).then(
      (success) => {
        if (success) {
          console.log('✅ Navigation successful!');
          console.log('New URL:', window.location.href);
        } else {
          console.log('⚠️ Navigation returned false');
          // Try alternative method
          this.tryAlternativeNavigation();
        }
      },
      (error) => {
        console.error('❌ Navigation error:', error);
        this.tryAlternativeNavigation();
      }
    );
  }

  private tryAlternativeNavigation() {
    console.log('Trying alternative navigation method...');
    
    // Method 1: navigateByUrl
    this.router.navigateByUrl('/consumer/ai-assistant').then(
      (success) => {
        console.log('navigateByUrl result:', success ? '✅ Success' : '❌ Failed');
        if (!success) {
          // Method 2: Window location (direct)
          console.log('Trying window.location.href...');
          window.location.href = '/consumer/ai-assistant';
        }
      },
      (error) => {
        console.error('navigateByUrl error:', error);
        // Method 2: Window location (direct)
        console.log('Trying window.location.href...');
        window.location.href = '/consumer/ai-assistant';
      }
    );
  }
  
  // Method to toggle modal version (kept for backward compatibility)
  toggleAIAssistant() {
    console.log('Toggling AI Assistant modal');
    this.showAIAssistant = !this.showAIAssistant;
  }
}