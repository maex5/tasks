import { AppState, ChildId, TaskSetId } from '../types';

export const CHILD_TASK_SET_MAP: Record<ChildId, TaskSetId> = {
  alex: 'alex_tasks',
  cecci: 'cecci_tasks',
  vicka: 'vicka_tasks',
} as const;

export const CHILD_BACKGROUNDS: Record<ChildId, string> = {
  alex: `
    radial-gradient(circle at 20% 20%, #FFA500 0%, transparent 45%),
    radial-gradient(circle at 80% 30%, #0066FF 0%, transparent 50%),
    radial-gradient(circle at 40% 70%, #FFA500 0%, transparent 45%),
    radial-gradient(circle at 75% 80%, #0066FF 0%, transparent 40%),
    linear-gradient(45deg, rgba(255, 165, 0, 0.2), rgba(0, 102, 255, 0.2))
  `,
  cecci: `
    radial-gradient(circle at 25% 25%, #fbd3e9 0%, transparent 45%),
    radial-gradient(circle at 75% 35%, #bb377d 0%, transparent 50%),
    radial-gradient(circle at 35% 65%, #fbd3e9 0%, transparent 45%),
    radial-gradient(circle at 70% 85%, #bb377d 0%, transparent 40%),
    linear-gradient(45deg, rgba(251, 211, 233, 0.2), rgba(187, 55, 125, 0.2))
  `,
  vicka: `
    radial-gradient(circle at 30% 30%, #ff4e50 0%, transparent 45%),
    radial-gradient(circle at 70% 25%, #f9d423 0%, transparent 50%),
    radial-gradient(circle at 45% 75%, #ff4e50 0%, transparent 45%),
    radial-gradient(circle at 80% 70%, #f9d423 0%, transparent 40%),
    linear-gradient(45deg, rgba(255, 78, 80, 0.2), rgba(249, 212, 35, 0.2))
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
        brush_teeth_evening: { id: 'brush_teeth_evening', name: '🪥🌙', emoji: '🪥🌙', order: 5 },
      }
    },
    vicka_tasks: {
      id: 'vicka_tasks',
      name: 'Vicka\'s Tasks',
      tasks: {
        clean_room: { id: 'clean_room', name: '🧹', emoji: '🧹', order: 1 },
        practice_piano: { id: 'practice_piano', name: '🎹', emoji: '🎹', order: 2 },
        read_book: { id: 'read_book', name: '📖', emoji: '📖', order: 3 },
        water_plants: { id: 'water_plants', name: '🪴', emoji: '🪴', order: 4 },
        feed_fish: { id: 'feed_fish', name: '🐠', emoji: '🐠', order: 5 }
      }
    },
    cecci_tasks: {
      id: 'cecci_tasks',
      name: 'Cecci\'s Tasks',
      tasks: {
        draw_picture: { id: 'draw_picture', name: '🎨', emoji: '🎨', order: 1 },
        dance_practice: { id: 'dance_practice', name: '💃', emoji: '💃', order: 2 },
        help_cooking: { id: 'help_cooking', name: '👩‍🍳', emoji: '👩‍🍳', order: 3 },
        tidy_toys: { id: 'tidy_toys', name: '🧸', emoji: '🧸', order: 4 },
        feed_cat: { id: 'feed_cat', name: '🐱', emoji: '🐱', order: 5 }
      }
    }
  },
  children: {
    alex: {
      id: 'alex',
      name: 'Alex',
      taskSetId: 'alex_tasks',
      completedTasks: [],
      backgroundColor: 'linear-gradient(to bottom right, #FFA500, #0066FF)'
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