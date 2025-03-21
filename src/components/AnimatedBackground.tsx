import { memo } from 'react';
import { motion } from 'framer-motion';
import './AnimatedBackground.css';

interface AnimatedBackgroundProps {
  colors: [string, string];
  className?: string;
}

function AnimatedBackground({ colors: [color1, color2], className = '' }: AnimatedBackgroundProps) {
  return (
    <div className={`animated-background ${className}`}>
      <svg
        className="background-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="gradient1" cx="20%" cy="20%" r="50%">
            <stop offset="0%" stopColor={color1} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color1} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gradient2" cx="80%" cy="30%" r="50%">
            <stop offset="0%" stopColor={color2} stopOpacity="0.85" />
            <stop offset="100%" stopColor={color2} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gradient3" cx="40%" cy="70%" r="50%">
            <stop offset="0%" stopColor={color1} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color1} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gradient4" cx="75%" cy="80%" r="50%">
            <stop offset="0%" stopColor={color2} stopOpacity="0.85" />
            <stop offset="100%" stopColor={color2} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="baseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color2} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Base gradient */}
        <rect x="0" y="0" width="100" height="100" fill="url(#baseGradient)" />

        {/* Animated circles */}
        <motion.circle
          cx="20"
          cy="20"
          r="30"
          fill="url(#gradient1)"
          animate={{
            cx: [20, 22, 20, 18, 20],
            cy: [20, 22, 20, 18, 20],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.circle
          cx="80"
          cy="30"
          r="35"
          fill="url(#gradient2)"
          animate={{
            cx: [80, 78, 80, 82, 80],
            cy: [30, 32, 30, 28, 30],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.circle
          cx="40"
          cy="70"
          r="30"
          fill="url(#gradient3)"
          animate={{
            cx: [40, 42, 40, 38, 40],
            cy: [70, 68, 70, 72, 70],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.circle
          cx="75"
          cy="80"
          r="25"
          fill="url(#gradient4)"
          animate={{
            cx: [75, 77, 75, 73, 75],
            cy: [80, 78, 80, 82, 80],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </svg>
    </div>
  );
}

export default memo(AnimatedBackground); 