import { memo } from 'react';
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
        viewBox="-100 -100 300 300"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="blur">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <radialGradient id="gradient1" cx="50%" cy="50%" r="150%">
            <stop offset="0%" stopColor={color1} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color1} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gradient2" cx="50%" cy="50%" r="150%">
            <stop offset="0%" stopColor={color2} stopOpacity="0.85" />
            <stop offset="100%" stopColor={color2} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gradient3" cx="50%" cy="50%" r="150%">
            <stop offset="0%" stopColor={color1} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color1} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gradient4" cx="50%" cy="50%" r="150%">
            <stop offset="0%" stopColor={color2} stopOpacity="0.85" />
            <stop offset="100%" stopColor={color2} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gradient5" cx="50%" cy="50%" r="150%">
            <stop offset="0%" stopColor={color1} stopOpacity="0.75" />
            <stop offset="100%" stopColor={color1} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gradient6" cx="50%" cy="50%" r="150%">
            <stop offset="0%" stopColor={color2} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color2} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="baseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color2} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Base gradient */}
        <rect x="-300" y="-300" width="900" height="900" fill="url(#baseGradient)" />

        {/* Animated shapes */}
        <path
          className="blob blob1"
          d="M -100,-100 C -75,-125 -25,-125 0,-100 C 25,-75 50,-25 25,0 C 0,25 -50,50 -75,25 C -100,0 -125,-50 -100,-75 C -100,-87 -100,-100 -100,-100"
          fill="url(#gradient1)"
          filter="url(#blur)"
        />
        <path
          className="blob blob2"
          d="M 75,75 C 100,50 150,50 175,75 C 200,100 225,150 200,175 C 175,200 125,225 100,200 C 75,175 50,125 75,100 C 75,87 75,75 75,75"
          fill="url(#gradient2)"
          filter="url(#blur)"
        />
        <path
          className="blob blob3"
          d="M -75,-75 C -50,-100 0,-100 25,-75 C 50,-50 75,0 50,25 C 25,50 -25,75 -50,50 C -75,25 -100,-25 -75,-50 C -75,-62 -75,-75 -75,-75"
          fill="url(#gradient1)"
          filter="url(#blur)"
        />
      </svg>
    </div>
  );
}

export default memo(AnimatedBackground); 