import { useCallback } from 'react';
import { Task } from '../types';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  completedTasks: string[];
  onTaskToggle: (taskId: string) => void;
}

export default function TaskList({ tasks, completedTasks, onTaskToggle }: TaskListProps) {
  const playSound = useCallback(() => {
    const audio = new Audio('/tasks/switch-sound.mp3');
    audio.volume = 0.1;
    audio.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  }, []);

  const handleTaskClick = useCallback((taskId: string) => {
    playSound();
    onTaskToggle(taskId);
  }, [onTaskToggle, playSound]);

  return (
    <div className="task-list" role="list">
      {tasks.map((task) => (
        <button
          key={task.id}
          onClick={() => handleTaskClick(task.id)}
          className={`task-button ${completedTasks.includes(task.id) ? 'completed' : ''}`}
          aria-label={task.name}
          aria-pressed={completedTasks.includes(task.id)}
        >
          <span className="task-emoji" role="img" aria-label={task.name}>
            {task.emoji}
          </span>
        </button>
      ))}
    </div>
  );
} 