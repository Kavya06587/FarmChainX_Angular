// src/app/core/services/support.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Ticket {
  id: string;
  ticketId: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  reportedById: string;
  reportedByRole: string;
  createdAt: string;
  updatedAt: string;
  issueType?: string;
  messages?: Message[];
}

export interface Message {
  id: string;
  ticketId: string;
  senderId: string;
  senderRole: string;
  message: string;
  isAdminResponse: boolean;
  createdAt: string;
}

export interface SupportStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
}

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private baseUrl = 'http://localhost:8080/api';
  
  // Common headers
  private getHeaders(): HttpHeaders {
    const admin = JSON.parse(localStorage.getItem('admin') || '{}');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${admin.token || ''}`
    });
  }

  constructor(private http: HttpClient) {}

  // ========== TICKET METHODS ==========

  // Create a new ticket - ADD THIS METHOD
  createTicket(ticketData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/support/tickets`, ticketData, {
      headers: this.getHeaders()
    });
  }

  // Get all tickets - Based on React patterns
  getAllTickets(): Observable<any> {
    return this.http.post(`${this.baseUrl}/support/tickets`, {}, {
      headers: this.getHeaders()
    });
  }

  // Alternative: Try admin endpoint
  getAdminTickets(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/tickets`, {
      headers: this.getHeaders()
    });
  }

  // Alternative: Try support endpoint with query
  getTicketsWithQuery(): Observable<any> {
    return this.http.get(`${this.baseUrl}/support?action=getTickets`, {
      headers: this.getHeaders()
    });
  }

  // Based on common REST patterns
  getTicketsCommon(): Observable<any> {
    return this.http.get(`${this.baseUrl}/tickets/all`, {
      headers: this.getHeaders()
    });
  }

  // Get mock data for development
  getMockTickets(): Observable<any> {
    const mockTickets = [
      {
        id: '1',
        ticketId: 'TCK-001',
        subject: 'Login Issue',
        description: 'Unable to login to the dashboard',
        status: 'OPEN',
        priority: 'HIGH',
        reportedById: '101',
        reportedByRole: 'FARMER',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        issueType: 'TECHNICAL',
        messages: [
          {
            id: '1',
            ticketId: '1',
            senderId: '101',
            senderRole: 'FARMER',
            message: 'I cannot login to my account',
            isAdminResponse: false,
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            ticketId: '1',
            senderId: '1',
            senderRole: 'ADMIN',
            message: 'We are looking into this issue',
            isAdminResponse: true,
            createdAt: '2024-01-15T11:00:00Z'
          }
        ]
      },
      {
        id: '2',
        ticketId: 'TCK-002',
        subject: 'Payment Failed',
        description: 'Payment not processed for order #12345',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        reportedById: '102',
        reportedByRole: 'BUYER',
        createdAt: '2024-01-14T14:20:00Z',
        updatedAt: '2024-01-15T09:15:00Z',
        issueType: 'PAYMENT'
      },
      {
        id: '3',
        ticketId: 'TCK-003',
        subject: 'Delivery Delay',
        description: 'Order not delivered as promised',
        status: 'RESOLVED',
        priority: 'LOW',
        reportedById: '103',
        reportedByRole: 'DISTRIBUTOR',
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-12T16:45:00Z',
        issueType: 'DELIVERY'
      }
    ];

    return of({
      success: true,
      tickets: mockTickets,
      message: 'Using mock data for development'
    });
  }

  // Get ticket messages
  getTicketMessages(ticketId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/support/tickets/${ticketId}/messages`, {
      headers: this.getHeaders()
    });
  }

  // Add message to ticket
  addMessageToTicket(ticketId: string, messageData: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/support/tickets/${ticketId}/messages`, 
      messageData,
      { headers: this.getHeaders() }
    );
  }

  // Update ticket status
  updateTicketStatus(ticketId: string, status: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/support/tickets/${ticketId}/status`,
      { status },
      { headers: this.getHeaders() }
    );
  }

  // Get support stats
  getSupportStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/support/stats`, {
      headers: this.getHeaders()
    });
  }
}