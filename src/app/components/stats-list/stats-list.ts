import { Component, inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard';

@Component({
  selector: 'app-stats-list',
  standalone: true,
  imports: [],
  templateUrl: './stats-list.html',
  styleUrl: './stats-list.css',
})
export class StatsList {
  dashboard = inject(DashboardService);
}
