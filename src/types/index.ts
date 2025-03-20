export interface Task {
  id: string;
  name: string;
  emoji: string;
}

export interface Child {
  id: string;
  name: string;
  completedTasks: string[];
  backgroundColor: string;
}

export interface AppState {
  tasks: Record<string, Task>;
  children: Record<string, Child>;
}

export type EmojiState = '😭' | '😢' | '😐' | '🙂' | '😃' | '🤩';

export interface TaskButtonProps {
  task: Task;
  isCompleted: boolean;
  onToggle: (taskId: string) => void;
}

export interface EmojiProgressProps {
  completedTasks: string[];
  totalTasks: number;
}

export interface ChildPageProps {
  child: Child;
  tasks: Task[];
  onTaskToggle: (childId: string, taskId: string) => void;
} 