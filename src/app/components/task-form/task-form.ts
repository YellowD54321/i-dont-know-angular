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
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, debounceTime, tap } from 'rxjs';
import { LucideAngularModule, Check, TriangleAlert, Ban, Trash2, Plus, X } from 'lucide-angular';
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
  imports: [ReactiveFormsModule, FormsModule, JsonPipe, LucideAngularModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private taskStorage = inject(TaskStorageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  readonly Check = Check;
  readonly TriangleAlert = TriangleAlert;
  readonly Ban = Ban;
  readonly Trash2 = Trash2;
  readonly Plus = Plus;
  readonly X = X;

  tagInput = '';
  draftSaved = signal(false);
  isEditMode = signal(false);
  private taskId: string | null = null;
  private draftSavedTimeout: ReturnType<typeof setTimeout> | null = null;

  taskForm = this.fb.group({
    title: ['', [Validators.required, minLengthValidator(5), forbiddenKeywordsValidator()]],
    description: [''],
    priority: this.fb.control<'low' | 'medium' | 'high'>('medium'),
    subTasks: this.fb.array<SubTaskFormGroup>([]),
    tags: this.fb.array<FormControl<string>>([]),
  });

  ngOnInit(): void {
    // 檢查是否為編輯模式
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taskId = id;
      this.isEditMode.set(true);
      this.loadTaskForEdit(id);
    }

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

  private loadTaskForEdit(id: string): void {
    const task = this.taskStorage.getTaskById(id);
    if (!task) {
      this.router.navigate(['/tasks']);
      return;
    }

    // 使用 patchValue 填入基本欄位
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
    });

    // 動態建立並填入 subTasks FormArray
    this.subTasks.clear();
    task.subTasks.forEach(subTask => {
      const subTaskGroup = this.fb.nonNullable.group({
        id: subTask.id,
        content: [subTask.content, requiredContentValidator()],
        completed: subTask.completed,
      });
      this.subTasks.push(subTaskGroup);
    });

    // 動態建立並填入 tags FormArray
    this.tags.clear();
    task.tags.forEach(tag => {
      this.tags.push(this.fb.nonNullable.control(tag));
    });
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

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    const formValue = this.taskForm.getRawValue();
    this.taskStorage.saveTask({
      id: this.taskId || undefined,
      title: formValue.title || '',
      description: formValue.description || '',
      priority: formValue.priority || 'medium',
      subTasks: formValue.subTasks || [],
      tags: formValue.tags || [],
    });
    this.taskStorage.clearDraft();
    this.router.navigate(['/tasks']);
  }
}

