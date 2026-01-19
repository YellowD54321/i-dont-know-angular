import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StatsList } from './components/stats-list/stats-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StatsList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('i-dont-know-angular');
}
