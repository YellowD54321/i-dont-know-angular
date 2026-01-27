import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TaskStorageService } from '../../services/task-storage';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  private taskStorage = inject(TaskStorageService);
  private router = inject(Router);

  tasks = this.taskStorage.tasks;

  navigateToNew(): void {
    this.router.navigate(['/tasks/new']);
  }

  navigateToEdit(id: string): void {
    this.router.navigate(['/tasks', id, 'edit']);
  }

  deleteTask(id: string): void {
    if (confirm('確定要刪除這個任務嗎？')) {
      this.taskStorage.deleteTask(id);
    }
  }
}

