export type ChildId = 'alex' | 'cecci' | 'vicka';
export type TaskSetId = `${ChildId}_tasks`;

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
  lastReset: string | null;  // ISO string timestamp of last task reset
}

export interface TaskButtonProps {
  task: Task;
  isCompleted: boolean;
  onToggle: (taskId: string) => void;
}

export interface EmojiProgressProps {
  progress: number;
}

export interface ChildPageProps {
  child: Child;
  tasks: Task[];
  onTaskToggle: (childId: string, taskId: string) => void;
}

export type EmojiState = '🤩' | '😃' | '🙂' | '😐' | '😢' | '😭';

export function isValidChildId(id: string): id is ChildId {
  return ['alex', 'cecci', 'vicka'].includes(id);
}

export function isValidTaskSetId(id: string): id is TaskSetId {
  return id.endsWith('_tasks') && isValidChildId(id.replace('_tasks', ''));
} 