export interface SubTask {
  id: string;
  content: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  subTasks: SubTask[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

