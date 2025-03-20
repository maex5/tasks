export interface Task {
  id: string;
  name: string;
  emoji: string;
  order: number;
}

export interface TaskSet {
  id: string;
  name: string;
  tasks: Record<string, Task>;
}

export interface Child {
  id: string;
  name: string;
  taskSetId: string;
  completedTasks: string[];
  backgroundColor: string;
}

export interface AppState {
  taskSets: Record<string, TaskSet>;
  children: Record<string, Child>;
}

export interface TaskButtonProps {
  task: Task;
  isCompleted: boolean;
  onToggle: (taskId: string) => void;
}

export interface ChildPageProps {
  child: Child;
  tasks: Task[];
  onTaskToggle: (childId: string, taskId: string) => void;
}

export interface EmojiProgressProps {
  completedTasks: string[];
  totalTasks: number;
}

export type EmojiState = '😭' | '😢' | '😐' | '🙂' | '😃' | '🤩';