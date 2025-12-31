// src/app/core/services/notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Notification {
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

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Get notifications for user - try multiple endpoints
  getUserNotifications(userId: string, role: string): Observable<any> {
    // Try different endpoint patterns
    const endpoints = [
      `${this.baseUrl}/notifications/user/${userId}?role=${role}`,
      `${this.baseUrl}/users/${userId}/notifications?role=${role}`,
      `${this.baseUrl}/notifications?userId=${userId}&role=${role}`,
      `${this.baseUrl}/admin/notifications/${userId}?role=${role}`
    ];

    // Return first endpoint, handle error in component
    return this.http.get(endpoints[0]);
  }

  // Alternative method that returns mock data if API fails
  getUserNotificationsWithFallback(userId: string, role: string): Observable<any> {
    return new Observable(observer => {
      this.getUserNotifications(userId, role).subscribe({
        next: (response) => {
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          console.log('API failed, returning mock notifications');
          // Return mock data for development
          const mockNotifications = [
            {
              id: '1',
              userId: userId,
              userRole: role,
              title: 'Welcome to Admin Panel',
              message: 'You have successfully logged in as Administrator',
              type: 'INFO',
              read: false,
              createdAt: new Date().toISOString()
            },
            {
              id: '2',
              userId: userId,
              userRole: role,
              title: 'System Notification',
              message: 'All systems are running normally',
              type: 'SUCCESS',
              read: true,
              createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
            }
          ];
          observer.next(mockNotifications);
          observer.complete();
        }
      });
    });
  }

  // Mark notification as read
  markAsRead(notificationId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/notifications/${notificationId}/read`, {});
  }

  // Mark all as read
  markAllAsRead(userId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/notifications/user/${userId}/read-all`, {});
  }

  // Delete notification
  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/notifications/${notificationId}`);
  }
}