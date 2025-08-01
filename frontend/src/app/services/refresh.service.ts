import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  // Subject for notifying components to refresh data
  private refreshSource = new Subject<string>();
  
  // Observable that components can subscribe to
  public refresh$ = this.refreshSource.asObservable();

  constructor() { }

  // Method to trigger a refresh notification
  triggerRefresh(source: string) {
    this.refreshSource.next(source);
  }
}
