import { useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Child, Task, ChildId } from '../types';
import TaskList from './TaskList';
import EmojiProgress from './EmojiProgress';
import './ChildPage.css';

interface ChildPageProps {
  child: Child;
  tasks: Task[];
  onTaskToggle: (childId: ChildId, taskId: string) => void;
}

function ChildPage({ child, tasks, onTaskToggle }: ChildPageProps) {
  const completedCount = child.completedTasks?.length || 0;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  const prevCompletedCountRef = useRef(completedCount);

  const playPopSound = useCallback(() => {
    const audio = new Audio('/tasks/pop.mp3');
    audio.volume = 1.0;
    audio.play().catch(error => {
      console.error('Error playing pop sound:', error);
    });
  }, []);

  const triggerConfetti = useCallback(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 1500
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });

    playPopSound();
  }, [playPopSound]);

  useEffect(() => {
    if (completedCount === totalTasks && completedCount > prevCompletedCountRef.current) {
      triggerConfetti();
    }
    prevCompletedCountRef.current = completedCount;
  }, [completedCount, totalTasks, triggerConfetti]);

  return (
    <div className="child-page">
      <header className="child-header">
        <h1 className="child-name">{child.name}</h1>
        <EmojiProgress progress={progress} />
      </header>
      <TaskList
        tasks={tasks}
        completedTasks={child.completedTasks || []}
        onTaskToggle={(taskId) => onTaskToggle(child.id, taskId)}
      />
    </div>
  );
}

export default ChildPage; 