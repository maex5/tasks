/**
 * Core domain types
 */

export interface Task {
  /** Unique identifier for the task */
  id: string;
  /** Display name of the task */
  name: string;
  /** Emoji representation of the task */
  emoji: string;
  /** Order in which the task should appear */
  order: number;
}

export interface TaskSet {
  /** Unique identifier for the task set */
  id: string;
  /** Display name of the task set */
  name: string;
  /** Map of task IDs to tasks */
  tasks: Record<string, Task>;
}

export interface Child {
  /** Unique identifier for the child */
  id: string;
  /** Display name of the child */
  name: string;
  /** ID of the task set assigned to this child */
  taskSetId: string;
  /** List of completed task IDs */
  completedTasks: string[];
  /** Background color for the child's page */
  backgroundColor: string;
}

export interface AppState {
  /** Map of task set IDs to task sets */
  taskSets: Record<string, TaskSet>;
  /** Map of child IDs to children */
  children: Record<string, Child>;
}

/**
 * Component props types
 */

export interface TaskButtonProps {
  /** Task to display */
  task: Task;
  /** Whether the task is completed */
  isCompleted: boolean;
  /** Callback when task completion status is toggled */
  onToggle: (taskId: string) => void;
}

export interface ChildPageProps {
  /** Child whose tasks are being displayed */
  child: Child;
  /** List of tasks for the child */
  tasks: Task[];
  /** Callback when a task is toggled */
  onTaskToggle: (childId: string, taskId: string) => void;
}

export interface EmojiProgressProps {
  /** List of completed task IDs */
  completedTasks: string[];
  /** Total number of tasks */
  totalTasks: number;
}

/** Possible emoji states for progress indicator */
export type EmojiState = '😭' | '😢' | '😐' | '🙂' | '😃' | '🤩';