import { AppState, ChildId, TaskSetId } from '../types';

export const CHILD_TASK_SET_MAP: Record<ChildId, TaskSetId> = {
  alex: 'alex_tasks',
  cecci: 'cecci_tasks',
  vicka: 'vicka_tasks',
} as const;

export const CHILD_BACKGROUNDS: Record<ChildId, string> = {
  alex: `
    radial-gradient(circle at 20% 20%, rgba(176, 224, 255, 0.9) 0%, transparent 55%),
    radial-gradient(circle at 80% 30%, rgba(0, 71, 171, 0.85) 0%, transparent 60%),
    radial-gradient(circle at 40% 70%, rgba(68, 150, 255, 0.8) 0%, transparent 55%),
    radial-gradient(circle at 75% 80%, rgba(0, 0, 128, 0.85) 0%, transparent 50%),
    linear-gradient(45deg, rgba(176, 224, 255, 0.6), rgba(0, 71, 171, 0.6))
  `,
  cecci: `
    radial-gradient(circle at 25% 25%, rgba(255, 240, 245, 0.9) 0%, transparent 55%),
    radial-gradient(circle at 75% 35%, rgba(255, 182, 193, 0.85) 0%, transparent 60%),
    radial-gradient(circle at 35% 65%, rgba(255, 228, 225, 0.8) 0%, transparent 55%),
    radial-gradient(circle at 70% 85%, rgba(255, 192, 203, 0.85) 0%, transparent 50%),
    linear-gradient(45deg, rgba(255, 240, 245, 0.6), rgba(255, 182, 193, 0.6))
  `,
  vicka: `
    radial-gradient(circle at 30% 30%, rgba(255, 78, 80, 0.9) 0%, transparent 55%),
    radial-gradient(circle at 70% 25%, rgba(249, 212, 35, 0.85) 0%, transparent 60%),
    radial-gradient(circle at 45% 75%, rgba(255, 99, 71, 0.8) 0%, transparent 55%),
    radial-gradient(circle at 80% 70%, rgba(255, 215, 0, 0.85) 0%, transparent 50%),
    linear-gradient(45deg, rgba(255, 78, 80, 0.6), rgba(249, 212, 35, 0.6))
  `,
} as const;

export const DEFAULT_STATE: AppState = {
  taskSets: {
    alex_tasks: {
      id: 'alex_tasks',
      name: 'Alex\'s Tasks',
      tasks: {
        make_bed: { id: 'make_bed', name: '🛏️', emoji: '🛏️', order: 1 },
        brush_teeth_morning: { id: 'brush_teeth_morning', name: '🪥☀️', emoji: '🪥☀️', order: 2 },
        do_homework: { id: 'do_homework', name: '📚✏️', emoji: '📚✏️', order: 3 },
        take_dog_out: { id: 'take_dog_out', name: '🐶', emoji: '🐶', order: 4 },
        clean_room: { id: 'clean_room', name: '🧹', emoji: '🧹', order: 5 },
        brush_teeth_evening: { id: 'brush_teeth_evening', name: '🪥🌙', emoji: '🪥🌙', order: 6 },
      }
    },
    vicka_tasks: {
      id: 'vicka_tasks',
      name: 'Vicka\'s Tasks',
      tasks: {
        make_bed: { id: 'make_bed', name: '🛏️', emoji: '🛏️', order: 1 },
        brush_teeth_morning: { id: 'brush_teeth_morning', name: '🪥☀️', emoji: '🪥☀️', order: 2 },
        do_homework: { id: 'do_homework', name: '📚✏️', emoji: '📚✏️', order: 3 },
        take_dog_out: { id: 'take_dog_out', name: '🐶', emoji: '🐶', order: 4 },
        clean_room: { id: 'clean_room', name: '🧹', emoji: '🧹', order: 5 },
        brush_teeth_evening: { id: 'brush_teeth_evening', name: '🪥🌙', emoji: '🪥🌙', order: 6 },
      }
    },
    cecci_tasks: {
      id: 'cecci_tasks',
      name: 'Cecci\'s Tasks',
      tasks: {
        make_bed: { id: 'make_bed', name: '🛏️', emoji: '🛏️', order: 1 },
        brush_teeth_morning: { id: 'brush_teeth_morning', name: '🪥☀️', emoji: '🪥☀️', order: 2 },
        clean_room: { id: 'clean_room', name: '🧹', emoji: '🧹', order: 3 },
        draw_picture: { id: 'draw_picture', name: '🎨✏️', emoji: '🎨✏️', order: 4 },
        play: { id: 'play', name: '🧸🪁', emoji: '🧸🪁', order: 5 },
        go_out: { id: 'go_out', name: '🏃🌳', emoji: '🏃🌳', order: 6 },
        brush_teeth_evening: { id: 'brush_teeth_evening', name: '🪥🌙', emoji: '🪥🌙', order: 7 },
      }
    }
  },
  children: {
    alex: {
      id: 'alex',
      name: 'Alex',
      taskSetId: 'alex_tasks',
      completedTasks: [],
      backgroundColor: 'linear-gradient(to bottom right, #B0E0FF, #0047AB)'
    },
    cecci: {
      id: 'cecci',
      name: 'Cecci',
      taskSetId: 'cecci_tasks',
      completedTasks: [],
      backgroundColor: 'linear-gradient(to bottom right, #fbd3e9, #bb377d)'
    },
    vicka: {
      id: 'vicka',
      name: 'Vicka',
      taskSetId: 'vicka_tasks',
      completedTasks: [],
      backgroundColor: 'linear-gradient(to bottom right, #ff4e50, #f9d423)'
    }
  },
  lastReset: null
}; 