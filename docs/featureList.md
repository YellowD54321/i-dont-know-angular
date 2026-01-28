# 📋 任務管理器 - Reactive Forms 練習專案

> 目標：練習如何處理**深層巢狀數據**、**動態欄位**以及**強型別的表單驗證**。

---

## 📦 資料型別定義

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  subTasks: SubTask[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface SubTask {
  id: string;
  content: string;
  completed: boolean;
}
```

---

## 🗂️ 元件結構

```
src/app/
├── models/
│   └── task.model.ts          # Task, SubTask 介面
├── services/
│   └── task-storage.ts        # LocalStorage CRUD
├── components/
│   ├── task-list/             # 列表頁
│   └── task-form/             # 表單頁（新增/編輯共用）
└── app.routes.ts              # 路由設定
```

---

## 🎯 功能清單 (Feature List)

### 1. 路由架構
- [x] `/tasks` - 任務列表頁
- [x] `/tasks/new` - 新增任務
- [x] `/tasks/:id/edit` - 編輯現有任務

### 2. LocalStorage 持久化
- [x] 讀取/寫入任務列表到 LocalStorage
- [x] 自動存檔草稿（搭配 `debounceTime`）
- [x] 產生唯一 ID（使用 `crypto.randomUUID()`）

### 3. 任務列表頁
- [x] 顯示所有任務
- [x] 點擊任務導航到編輯頁
- [x] 新增任務按鈕導航到新增頁
- [x] 刪除任務功能

### 4. 任務建立/編輯面板
- [x] 基礎欄位：標題
- [x] 基礎欄位：描述
- [x] 基礎欄位：優先級（Select）
- [ ] **動態子任務 (Sub-tasks)**：可以動態新增/刪除多個子任務列
- [ ] **標籤系統 (Tags)**：輸入標籤並按 Enter 加入（處理陣列數據）

### 5. 表單提交流程
- [ ] 提交後導航回列表頁
- [ ] 編輯模式需從 LocalStorage 載入現有資料並 `patchValue` 到表單

### 6. 即時驗證系統
- [ ] 標題必填且長度需大於 5
- [ ] 子任務如果存在，內容不可為空
- [ ] 自定義驗證器：例如「禁止包含特定關鍵字」

### 7. 異步狀態同步
- [ ] 當表單數值改變時，即時顯示「草稿已保存」提示
- [ ] 監聽整個表單的 `statusChanges`

---

## 🚀 執行步驟 (Step-by-Step)

> 依照依賴關係排序，建議按順序執行

### 步驟 1：定義 Task 介面與 TaskStorageService
- [x] 在 `models/task.model.ts` 定義 `Task` 和 `SubTask` 介面
- [x] 建立 `services/task-storage.ts` 處理 LocalStorage CRUD
- [x] 實作 `getAllTasks()`, `getTaskById()`, `saveTask()`, `deleteTask()` 方法
- [x] 使用 `crypto.randomUUID()` 產生唯一 ID

> **React 對照：** 這就像建立一個 custom hook 來封裝 localStorage 操作。

### 步驟 2：設定路由
- [x] 在 `app.routes.ts` 設定三個路由
- [x] `/tasks` → TaskListComponent
- [x] `/tasks/new` → TaskFormComponent
- [x] `/tasks/:id/edit` → TaskFormComponent

> **React 對照：** 類似 React Router 的 `<Route path="/tasks/:id/edit" element={<TaskForm />} />`

### 步驟 3：初始化 Reactive Forms 環境（Standalone Components 架構）
- [x] 在需要使用表單的組件中引入 `ReactiveFormsModule`（透過組件裝飾器的 `imports` 陣列）

```typescript
// task-form.ts - Standalone 組件範例
@Component({
  standalone: true,
  imports: [ReactiveFormsModule],  // 👈 直接在組件層級引入
  // ...
})
export class TaskForm { }
```

> **React 對照：** 在 Standalone 架構下，這更像是直接 `import` 需要的模組，而非在全域 Context Provider 中設定。每個組件自己管理依賴，類似 React 的模組化方式。

### 步驟 4：建立任務列表頁組件
- [x] 建立 `task-list` 組件
- [x] 注入 `TaskStorageService` 讀取任務列表
- [x] 使用 `@for` 遍歷顯示任務
- [x] 實作導航到新增/編輯頁的按鈕
- [x] 實作刪除任務功能

> **React 對照：** 類似一個使用 `useEffect` 載入資料並用 `map` 渲染列表的組件。

### 步驟 5：建立基礎 Form Structure (FormBuilder)
- [x] 使用 `FormBuilder` 定義表單結構
- [x] 學習 `FormControl` (單一欄位)
- [x] 學習 `FormGroup` (物件)
- [x] 學習 `FormArray` (陣列)

```typescript
fb = inject(FormBuilder);
taskForm = this.fb.group({
  title: ['', [Validators.required, Validators.minLength(5)]],
  description: [''],
  priority: ['medium'],
  subTasks: this.fb.array([]),
  tags: this.fb.array([])
});
```

### 步驟 6：實作動態欄位 (FormArray) + 標籤系統
- [ ] 建立一個「新增子任務」按鈕
- [ ] 點擊時向 `subTasks` 這個 `FormArray` push 新的 `FormGroup`
- [ ] 在 HTML 中使用 `@for` 遍歷 `subTasks.controls`
- [ ] 使用 `formControlName` 綁定
- [ ] 實作標籤輸入框，按 Enter 加入標籤到 `tags` FormArray

### 步驟 7：自定義驗證器 (Custom Validators)
- [ ] 寫一個 Function 來檢查標題長度
- [ ] 實作「禁止包含特定關鍵字」驗證器
- [ ] 檢查子任務內容不可為空
- [ ] 了解如何回傳 `ValidatorFn`
- [ ] 在模板中透過 `taskForm.get('title')?.errors` 顯示錯誤訊息

### 步驟 8：使用 RxJS 監聽表單變化 + 自動存檔
- [ ] 使用 `this.taskForm.valueChanges.pipe(debounceTime(500))` 實作自動存檔功能
- [ ] 將草稿存入 LocalStorage
- [ ] 顯示「草稿已保存」提示
- [ ] 當表單狀態變為 `INVALID` 時，禁用提交按鈕

### 步驟 9：完善 UI 與錯誤提示
- [ ] 為每個驗證錯誤顯示對應的錯誤訊息
- [ ] 使用條件樣式標示錯誤欄位
- [ ] 優化整體頁面樣式與互動體驗

---

## 💡 重點觀念 (對 React 開發者)

| Angular | React 對照 |
|---------|-----------|
| 真相來源在組件類別的表單物件 | `value={state}` 同步 input |
| 內建 `pristine`, `dirty`, `touched` 狀態 | 需自己寫 `onBlur` 邏輯 |
| Angular 14+ 強型別表單 | 需搭配 TypeScript 額外設定 |
| `ActivatedRoute` + `paramMap` | `useParams()` |
| `Router.navigate()` | `useNavigate()` |
| `valueChanges.pipe(debounceTime())` | `useEffect` + `setTimeout` |
| `patchValue()` / `setValue()` | 設定 `defaultValues` |

---

## 🛠️ 推薦工具

- [ ] **Tailwind CSS**: 快速刻出側邊抽屜式（Drawer）的編輯介面
- [ ] **Lucide Angular**: 圖標庫，適合用在任務分類上
