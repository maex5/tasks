import { Task } from '../../types';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  completedTasks: string[];
  onTaskToggle: (taskId: string) => void;
}

function TaskList({ tasks, completedTasks, onTaskToggle }: TaskListProps) {
  return (
    <div className="task-list">
      {tasks.map((task) => {
        const isCompleted = completedTasks.includes(task.id);
        return (
          <button
            key={task.id}
            className={`task-button ${isCompleted ? 'completed' : ''}`}
            onClick={() => onTaskToggle(task.id)}
            aria-pressed={isCompleted}
          >
            <span className="task-emoji" role="img" aria-label={task.name}>
              {task.emoji}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default TaskList; 