import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, tap } from 'rxjs';
import {
  minLengthValidator,
  forbiddenKeywordsValidator,
  requiredContentValidator,
} from '../../validators/task.validators';
import { TaskStorageService } from '../../services/task-storage';

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
export class TaskForm implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private taskStorage = inject(TaskStorageService);
  private destroy$ = new Subject<void>();

  tagInput = '';
  draftSaved = signal(false);
  private draftSavedTimeout: ReturnType<typeof setTimeout> | null = null;

  taskForm = this.fb.group({
    title: ['', [Validators.required, minLengthValidator(5), forbiddenKeywordsValidator()]],
    description: [''],
    priority: this.fb.control<'low' | 'medium' | 'high'>('medium'),
    subTasks: this.fb.array<SubTaskFormGroup>([]),
    tags: this.fb.array<FormControl<string>>([]),
  });

  ngOnInit(): void {
    // 監聽表單值變化，使用 debounceTime 自動存檔草稿
    this.taskForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        tap((value) => {
          this.taskStorage.saveDraft(value as any);
          this.showDraftSavedMessage();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.draftSavedTimeout) {
      clearTimeout(this.draftSavedTimeout);
    }
  }

  private showDraftSavedMessage(): void {
    this.draftSaved.set(true);
    // 清除之前的計時器
    if (this.draftSavedTimeout) {
      clearTimeout(this.draftSavedTimeout);
    }
    // 2秒後隱藏提示
    this.draftSavedTimeout = setTimeout(() => {
      this.draftSaved.set(false);
    }, 2000);
  }

  get subTasks() {
    return this.taskForm.controls.subTasks;
  }

  get tags() {
    return this.taskForm.controls.tags;
  }

  addSubTask(): void {
    const subTask = this.fb.nonNullable.group({
      id: crypto.randomUUID() as string,
      content: ['', requiredContentValidator()],
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

