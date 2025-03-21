import { useState, useEffect } from 'react';
import { useFirebaseState } from './hooks/useFirebaseState';
import { useTaskReset } from './hooks/useTaskReset';
import ChildPage from './components/ChildPage';
import AnimatedBackground from './components/AnimatedBackground';
import { ChildId, isValidChildId, Child, Task } from './types';
import { CHILD_TASK_SET_MAP } from './config/tasks';
import './App.css';

const CURRENT_CHILD_KEY = 'current-child';
const CHILD_IDS = ['alex', 'cecci', 'vicka'] as const;

const CHILD_COLORS: Record<ChildId, [string, string]> = {
  alex: ['#B0E0FF', '#0047AB'],
  cecci: ['#fbd3e9', '#bb377d'],
  vicka: ['#ff4e50', '#f9d423'],
} as const;

function App() {
  const { 
    state, 
    isOnline, 
    isLoading, 
    error, 
    updateChild,
    updateState
  } = useFirebaseState();

  const [currentChildIndex, setCurrentChildIndex] = useState(() => {
    const savedChildId = localStorage.getItem(CURRENT_CHILD_KEY);
    if (!savedChildId || !isValidChildId(savedChildId)) return 0;
    
    const index = CHILD_IDS.indexOf(savedChildId as ChildId);
    return index >= 0 ? index : 0;
  });

  useTaskReset(state, updateState);

  useEffect(() => {
    const currentChildId = CHILD_IDS[currentChildIndex];
    if (currentChildId) {
      localStorage.setItem(CURRENT_CHILD_KEY, currentChildId);
    }
  }, [currentChildIndex]);

  if (isLoading || !state?.children || !state?.taskSets) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        {!isOnline && (
          <div className="alert alert-warning">
            Connecting to database...
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            {error.message}
          </div>
        )}
      </div>
    );
  }

  const children = Object.values(state.children) as Child[];
  const currentChild = children[currentChildIndex] || children[0];
  const taskSetId = CHILD_TASK_SET_MAP[currentChild.id];
  const currentTaskSet = state.taskSets[taskSetId];
  
  if (!currentTaskSet?.tasks) {
    return (
      <div className="loading-container">
        <div className="alert alert-error">
          No task set found for {currentChild.name}. Please check your configuration.
        </div>
      </div>
    );
  }

  const sortedTasks = Object.values(currentTaskSet.tasks)
    .sort((a: Task, b: Task) => a.order - b.order);

  const handleNextChild = () => setCurrentChildIndex((prev) => (prev + 1) % children.length);
  const handlePrevChild = () => setCurrentChildIndex((prev) => (prev - 1 + children.length) % children.length);

  const handleTaskToggle = async (childId: ChildId, taskId: string) => {
    if (!state || !isOnline || !isValidChildId(childId)) return;

    const child = state.children[childId];
    if (!child) {
      console.error('Child not found:', childId);
      return;
    }

    const currentCompletedTasks = Array.isArray(child.completedTasks) ? child.completedTasks : [];
    const completedTasks = currentCompletedTasks.includes(taskId)
      ? currentCompletedTasks.filter((id: string) => id !== taskId)
      : [...currentCompletedTasks, taskId];

    try {
      await updateChild(childId, { completedTasks });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  return (
    <div className="app-container">
      <AnimatedBackground colors={CHILD_COLORS[currentChild.id]} />
      <div className="main-container">
        <nav className="nav-bar">
          <button 
            onClick={handlePrevChild} 
            className="nav-button"
            aria-label="Previous child"
          >
            ←
          </button>
          <div className="nav-spacer" />
          <button 
            onClick={handleNextChild} 
            className="nav-button"
            aria-label="Next child"
          >
            →
          </button>
        </nav>
        <ChildPage
          child={currentChild}
          tasks={sortedTasks}
          onTaskToggle={handleTaskToggle}
        />
      </div>
    </div>
  );
}

export default App; 