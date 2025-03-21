import { memo } from 'react';
import './AnimatedBackground.css';

interface AnimatedBackgroundProps {
  colors: [string, string];
  className?: string;
}

function AnimatedBackground({ colors: [color1, color2], className = '' }: AnimatedBackgroundProps) {
  // Create background colors based on the theme colors
  let backgroundColor;
  if (color1.toLowerCase().includes('ff9')) {
    backgroundColor = '#FFE6F3'; // Stronger pink for Cecci
  } else if (color1.toLowerCase().includes('ff4')) {
    backgroundColor = '#FFF1E6'; // Warm peach for Vicka
  } else {
    backgroundColor = '#E6F0FF'; // Stronger blue for Alex
  }
    
  return (
    <div className={`animated-background ${className}`}>
      <svg
        className="background-svg"
        viewBox="-100 -100 300 300"
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        style={{ willChange: 'transform' }}
      >
        <defs>
          <filter id="blur" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <radialGradient id="gradient1" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor={color1} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color1} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gradient2" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor={color2} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color2} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gradient3" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor={color1} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color2} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Light colored background */}
        <rect x="-100" y="-100" width="300" height="300" fill={backgroundColor} />

        {/* Optimized animated shapes */}
        <g style={{ isolation: 'isolate' }}>
          <circle
            className="blob blob1"
            cx="-20"
            cy="-20"
            r="90"
            fill="url(#gradient1)"
            filter="url(#blur)"
            style={{ willChange: 'transform' }}
          />
          <circle
            className="blob blob2"
            cx="120"
            cy="120"
            r="100"
            fill="url(#gradient2)"
            filter="url(#blur)"
            style={{ willChange: 'transform' }}
          />
          <circle
            className="blob blob3"
            cx="50"
            cy="50"
            r="80"
            fill="url(#gradient3)"
            filter="url(#blur)"
            style={{ willChange: 'transform' }}
          />
        </g>
      </svg>
    </div>
  );
}

export default memo(AnimatedBackground); 