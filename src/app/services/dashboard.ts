import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private rawData = signal([
    { id: 1, name: '流量', value: 100, category: 'tech' },
    { id: 2, name: '營收', value: 100, category: 'tech' },
  ])

  data = this.rawData.asReadonly();

  addData() {
    this.rawData.update(old => [
      ...old,
      { id: old.length + 1, name: '新資料', value: 100, category: 'tech' }
    ])
  }
}
