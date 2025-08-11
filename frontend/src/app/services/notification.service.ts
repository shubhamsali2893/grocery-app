import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    callback: () => void;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new Subject<Notification>();
  private notifications: Notification[] = [];

  constructor() {}

  getNotifications() {
    return this.notifications$.asObservable();
  }

  show(notification: Omit<Notification, 'id'>) {
    const id = Date.now().toString();
    const fullNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000
    };

    this.notifications.push(fullNotification);
    this.notifications$.next(fullNotification);

    // Auto remove after duration
    setTimeout(() => {
      this.remove(id);
    }, fullNotification.duration);
  }

  success(title: string, message: string, duration?: number) {
    this.show({
      type: 'success',
      title,
      message,
      duration
    });
  }

  error(title: string, message: string, duration?: number) {
    this.show({
      type: 'error',
      title,
      message,
      duration
    });
  }

  warning(title: string, message: string, duration?: number) {
    this.show({
      type: 'warning',
      title,
      message,
      duration
    });
  }

  info(title: string, message: string, duration?: number) {
    this.show({
      type: 'info',
      title,
      message,
      duration
    });
  }

  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  clear() {
    this.notifications = [];
  }
}
