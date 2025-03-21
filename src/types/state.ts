export type ChildId = 'alex' | 'cecci' | 'vicka';
export type TaskSetId = 'alex_tasks' | 'cecci_tasks' | 'vicka_tasks';

export interface Task {
  id: string;
  name: string;
  emoji: string;
  order: number;
}

export interface TaskSet {
  id: TaskSetId;
  name: string;
  tasks: Record<string, Task>;
}

export interface Child {
  id: ChildId;
  name: string;
  taskSetId: TaskSetId;
  completedTasks: string[];
  backgroundColor: string;
}

export interface AppState {
  taskSets: Record<TaskSetId, TaskSet>;
  children: Record<ChildId, Child>;
  lastReset: string | null;
}

export function isValidChildId(id: unknown): id is ChildId {
  return typeof id === 'string' && ['alex', 'cecci', 'vicka'].includes(id);
}

export function isValidTaskSetId(id: unknown): id is TaskSetId {
  return typeof id === 'string' && ['alex_tasks', 'cecci_tasks', 'vicka_tasks'].includes(id);
} 