import { Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, JsonPipe],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  private fb = inject(FormBuilder);
  tagInput = '';

  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: [''],
    priority: ['medium' as 'low' | 'medium' | 'high'],
    subTasks: this.fb.array([]),
    tags: this.fb.array([]),
  });

  get subTasks(): FormArray {
    return this.taskForm.get('subTasks') as FormArray;
  }

  get tags(): FormArray {
    return this.taskForm.get('tags') as FormArray;
  }

  addSubTask(): void {
    const subTask = this.fb.group({
      id: [crypto.randomUUID()],
      content: [''],
      completed: [false]
    });
    this.subTasks.push(subTask);
  }

  removeSubTask(index: number): void {
    this.subTasks.removeAt(index);
  }

  addTag(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.tagInput.trim()) {
      event.preventDefault();
      this.tags.push(this.fb.control(this.tagInput.trim()));
      this.tagInput = '';
    }
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }
}

