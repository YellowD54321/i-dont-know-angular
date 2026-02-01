import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, Plus, ClipboardList, Pencil, Trash2 } from 'lucide-angular';
import { TaskStorageService } from '../../services/task-storage';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  private taskStorage = inject(TaskStorageService);
  private router = inject(Router);

  readonly Plus = Plus;
  readonly ClipboardList = ClipboardList;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;

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

