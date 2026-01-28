import { Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';

type SubTaskFormGroup = FormGroup<{
  id: FormControl<string>;
  content: FormControl<string>;
  completed: FormControl<boolean>;
}>;

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
    priority: this.fb.control<'low' | 'medium' | 'high'>('medium'),
    subTasks: this.fb.array<SubTaskFormGroup>([]),
    tags: this.fb.array<FormControl<string>>([]),
  });

  get subTasks() {
    return this.taskForm.controls.subTasks;
  }

  get tags() {
    return this.taskForm.controls.tags;
  }

  addSubTask(): void {
    const subTask = this.fb.nonNullable.group({
      id: crypto.randomUUID() as string,
      content: '',
      completed: false,
    });
    this.subTasks.push(subTask);
  }

  removeSubTask(index: number): void {
    this.subTasks.removeAt(index);
  }

  addTag(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.tagInput.trim()) {
      event.preventDefault();
      this.tags.push(this.fb.nonNullable.control(this.tagInput.trim()));
      this.tagInput = '';
    }
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }
}

