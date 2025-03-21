import { AppState, ChildId, TaskSetId } from '../types/state';

export const CHILD_TASK_SET_MAP: Record<ChildId, TaskSetId> = {
  alex: 'alex_tasks',
  cecci: 'cecci_tasks',
  vicka: 'vicka_tasks',
};

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
      backgroundColor: '#FFE5F5'
    },
    cecci: {
      id: 'cecci',
      name: 'Cecci',
      taskSetId: 'cecci_tasks',
      completedTasks: [],
      backgroundColor: '#E5FFF0'
    },
    vicka: {
      id: 'vicka',
      name: 'Vicka',
      taskSetId: 'vicka_tasks',
      completedTasks: [],
      backgroundColor: '#E5E5FF'
    }
  },
  lastReset: null
}; 