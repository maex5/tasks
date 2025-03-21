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

        {/* Static organic shapes */}
        <g>
          {/* Large top-left blob */}
          <path
            d="M -150,-150 C -80,-180 0,-160 40,-100 C 80,-40 60,20 0,40 C -60,60 -140,40 -180,-20 C -220,-80 -220,-120 -150,-150"
            fill="url(#gradient1)"
            filter="url(#blur)"
          />
          {/* Large bottom-right blob */}
          <path
            d="M 100,80 C 160,40 220,60 260,120 C 300,180 280,240 220,260 C 160,280 80,260 40,200 C 0,140 40,120 100,80"
            fill="url(#gradient2)"
            filter="url(#blur)"
          />
          {/* Center blob */}
          <path
            d="M -20,-20 C 40,-60 100,-40 140,0 C 180,40 160,100 100,120 C 40,140 -20,120 -60,60 C -100,0 -80,-60 -20,-20"
            fill="url(#gradient3)"
            filter="url(#blur)"
          />
        </g>
      </svg>
    </div>
  );
}

export default memo(AnimatedBackground); 