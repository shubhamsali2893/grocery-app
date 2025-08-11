import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div 
        *ngFor="let notification of notifications"
        class="notification-toast"
        [ngClass]="'notification-' + notification.type"
        [@slideInOut]>
        <div class="notification-header">
          <div class="notification-icon">
            <i class="fas" [ngClass]="getIcon(notification.type)"></i>
          </div>
          <div class="notification-content">
            <h6 class="notification-title">{{ notification.title }}</h6>
            <p class="notification-message">{{ notification.message }}</p>
          </div>
          <button 
            class="notification-close" 
            (click)="removeNotification(notification.id)">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="notification-progress" *ngIf="notification.duration">
          <div class="progress-bar" [style.width.%]="getProgress(notification.id)"></div>
        </div>
        <div class="notification-action" *ngIf="notification.action">
          <button 
            class="btn btn-sm" 
            [ngClass]="'btn-' + notification.type"
            (click)="notification.action!.callback()">
            {{ notification.action!.label }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
    }
    
    .notification-toast {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      margin-bottom: 12px;
      overflow: hidden;
      animation: slideIn 0.3s ease-out;
    }
    
    .notification-header {
      display: flex;
      align-items: flex-start;
      padding: 16px;
      gap: 12px;
    }
    
    .notification-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .notification-content {
      flex: 1;
      min-width: 0;
    }
    
    .notification-title {
      margin: 0 0 4px 0;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .notification-message {
      margin: 0;
      font-size: 0.85rem;
      color: var(--gray-600);
      line-height: 1.4;
    }
    
    .notification-close {
      background: none;
      border: none;
      color: var(--gray-500);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }
    
    .notification-close:hover {
      background: var(--gray-100);
      color: var(--gray-700);
    }
    
    .notification-progress {
      height: 3px;
      background: var(--gray-200);
    }
    
    .progress-bar {
      height: 100%;
      background: var(--primary);
      transition: width 0.1s linear;
    }
    
    .notification-action {
      padding: 0 16px 16px;
    }
    
    /* Notification Types */
    .notification-success {
      border-left: 4px solid var(--success);
    }
    
    .notification-success .notification-icon {
      background: var(--success-light);
      color: var(--success);
    }
    
    .notification-error {
      border-left: 4px solid var(--danger);
    }
    
    .notification-error .notification-icon {
      background: var(--danger-light);
      color: var(--danger);
    }
    
    .notification-warning {
      border-left: 4px solid var(--warning);
    }
    
    .notification-warning .notification-icon {
      background: var(--warning-light);
      color: var(--warning);
    }
    
    .notification-info {
      border-left: 4px solid var(--secondary);
    }
    
    .notification-info .notification-icon {
      background: var(--secondary-light);
      color: var(--secondary);
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `],
  animations: [
    // You can add Angular animations here if needed
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();
  private progressIntervals: { [key: string]: any } = {};

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.getNotifications().subscribe(notification => {
      this.notifications.push(notification);
      this.startProgress(notification);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    Object.values(this.progressIntervals).forEach(interval => clearInterval(interval));
  }

  removeNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.stopProgress(id);
  }

  private startProgress(notification: Notification) {
    if (!notification.duration) return;

    const startTime = Date.now();
    const duration = notification.duration;

    this.progressIntervals[notification.id] = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.max(0, 100 - (elapsed / duration) * 100);

      if (progress <= 0) {
        this.removeNotification(notification.id);
      }
    }, 100);
  }

  private stopProgress(id: string) {
    if (this.progressIntervals[id]) {
      clearInterval(this.progressIntervals[id]);
      delete this.progressIntervals[id];
    }
  }

  getProgress(id: string): number {
    // This would be calculated based on the progress interval
    return 100;
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'fa-check-circle';
      case 'error': return 'fa-exclamation-circle';
      case 'warning': return 'fa-exclamation-triangle';
      case 'info': return 'fa-info-circle';
      default: return 'fa-info-circle';
    }
  }
}
