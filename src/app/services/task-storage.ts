import { Injectable, signal } from '@angular/core';
import { Task, SubTask } from '../models/task.model';

const STORAGE_KEY = 'task-manager-tasks';
const DRAFT_KEY = 'task-manager-draft';

@Injectable({
  providedIn: 'root',
})
export class TaskStorageService {
  tasks = signal<Task[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Task[];
        // 將日期字串轉換回 Date 物件
        const tasks = parsed.map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }));
        this.tasks.set(tasks);
      } catch (e) {
        console.error('無法解析 LocalStorage 資料:', e);
        this.tasks.set([]);
      }
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks()));
  }

  getAllTasks(): Task[] {
    return this.tasks();
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks().find(task => task.id === id);
  }

  saveTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Task {
    const now = new Date();

    if (task.id) {
      const existingIndex = this.tasks().findIndex(t => t.id === task.id);
      if (existingIndex !== -1) {
        const updatedTask: Task = {
          ...task as Task,
          updatedAt: now,
        };
        this.tasks.update(tasks => {
          const newTasks = [...tasks];
          newTasks[existingIndex] = updatedTask;
          return newTasks;
        });
        this.saveToStorage();
        return updatedTask;
      }
    }

    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    } as Task;

    this.tasks.update(tasks => [...tasks, newTask]);
    this.saveToStorage();
    return newTask;
  }

  deleteTask(id: string): boolean {
    const existingIndex = this.tasks().findIndex(t => t.id === id);
    if (existingIndex === -1) {
      return false;
    }

    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
    this.saveToStorage();
    return true;
  }

  createSubTask(content: string = ''): SubTask {
    return {
      id: crypto.randomUUID(),
      content,
      completed: false,
    };
  }

  saveDraft(draft: Partial<Task> & { id?: string }): void {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }

  getDraft(): (Partial<Task> & { id?: string }) | null {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  clearDraft(): void {
    localStorage.removeItem(DRAFT_KEY);
  }
}

