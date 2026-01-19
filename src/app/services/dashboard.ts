import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

export interface StatItem {
  id: number;
  name: string;
  value: string;
  trend: number;
  icon: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);

  data = signal<any[]>([]);

  constructor() {
    this.http.get<any[]>('/mockData/stats.json').subscribe(data => {
      this.data.set(data);
    });
  }

  addData() {
    this.data.update(old => [
      ...old,
      { id: old.length + 1, name: '新資料', value: 100, category: 'tech' }
    ])
  }
}
