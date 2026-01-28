import { Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  private fb = inject(FormBuilder);

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
}

