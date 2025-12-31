// src/app/shared/components/notification-bell/notification-bell.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';

// Define Notification interface locally if not in service
interface Notification {
  id: string;
  userId: string;
  userRole: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  createdAt: string;
  link?: string;
}

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css']
})
export class NotificationBellComponent implements OnInit {
  notifications: Notification[] = [];
  unreadCount = 0;
  showDropdown = false;
  loading = false;
  user: any = null;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.loadNotifications();
      }
    });
  }

  loadNotifications(): void {
    if (!this.user) return;
    
    this.loading = true;
    
    // Use the getUserNotifications method
    this.notificationService.getUserNotifications(
      this.user.id,
      this.user.role || 'ADMIN'
    ).subscribe({
      next: (response: any) => {
        // Handle different response formats
        if (Array.isArray(response)) {
          this.notifications = response;
        } else if (response && Array.isArray(response.notifications)) {
          this.notifications = response.notifications;
        } else if (response && Array.isArray(response.data)) {
          this.notifications = response.data;
        } else {
          console.log('Unexpected notification response format:', response);
          this.notifications = [];
        }
        
        this.updateUnreadCount();
      },
      error: (error: any) => {
        console.error('Error loading notifications:', error);
        // Use mock notifications if API fails
        this.notifications = this.getMockNotifications();
        this.updateUnreadCount();
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // Mock notifications for development
  getMockNotifications(): Notification[] {
    return [
      {
        id: '1',
        userId: this.user?.id || '1',
        userRole: this.user?.role || 'ADMIN',
        title: 'Welcome to Admin Panel',
        message: 'You have successfully logged in as Administrator',
        type: 'INFO',
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        userId: this.user?.id || '1',
        userRole: this.user?.role || 'ADMIN',
        title: 'System Notification',
        message: 'All systems are running normally',
        type: 'SUCCESS',
        read: true,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  }

  updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  markAsRead(notification: Notification, event: Event): void {
    event.stopPropagation();
    
    if (!notification.read) {
      notification.read = true;
      this.updateUnreadCount();
      
      // Try to update on server
      this.notificationService.markAsRead(notification.id).subscribe({
        error: (error: any) => {
          console.error('Error marking notification as read:', error);
          // Revert if API fails
          notification.read = false;
          this.updateUnreadCount();
        }
      });
    }
  }

  markAllAsRead(): void {
    const unreadNotifications = this.notifications.filter(n => !n.read);
    
    if (unreadNotifications.length === 0) return;
    
    // Update locally first
    this.notifications.forEach(n => n.read = true);
    this.unreadCount = 0;
    
    // Try to update on server
    if (this.user) {
      this.notificationService.markAllAsRead(this.user.id).subscribe({
        error: (error: any) => {
          console.error('Error marking all as read:', error);
          // Revert if API fails
          this.notifications.forEach((n, index) => {
            if (index < unreadNotifications.length) n.read = false;
          });
          this.updateUnreadCount();
        }
      });
    }
  }

  deleteNotification(notificationId: string, event: Event): void {
    event.stopPropagation();
    
    // Remove locally first
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.updateUnreadCount();
    
    // Try to delete on server
    this.notificationService.deleteNotification(notificationId).subscribe({
      error: (error: any) => {
        console.error('Error deleting notification:', error);
        // Reload notifications if delete fails
        this.loadNotifications();
      }
    });
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'SUCCESS': return '✅';
      case 'WARNING': return '⚠️';
      case 'ERROR': return '❌';
      default: return 'ℹ️';
    }
  }

  getNotificationClass(type: string): string {
    switch (type) {
      case 'SUCCESS': return 'bg-green-50 border-green-200';
      case 'WARNING': return 'bg-yellow-50 border-yellow-200';
      case 'ERROR': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  }
}