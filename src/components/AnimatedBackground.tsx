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

        {/* Animated organic shapes */}
        <motion.path
          initial={{
            d: "M -200,-200 C -150,-250 -50,-250 0,-200 C 50,-150 100,-50 50,0 C 0,50 -100,100 -150,50 C -200,0 -250,-100 -200,-150 C -200,-175 -200,-200 -200,-200"
          }}
          fill="url(#gradient1)"
          filter="url(#blur)"
          animate={{
            d: [
              "M -200,-200 C -150,-250 -50,-250 0,-200 C 50,-150 100,-50 50,0 C 0,50 -100,100 -150,50 C -200,0 -250,-100 -200,-150 C -200,-175 -200,-200 -200,-200",
              "M 100,100 C 150,50 250,50 300,100 C 350,150 400,250 350,300 C 300,350 200,400 150,350 C 100,300 50,200 100,150 C 100,125 100,100 100,100",
              "M 200,-200 C 250,-250 350,-250 400,-200 C 450,-150 500,-50 450,0 C 400,50 300,100 250,50 C 200,0 150,-100 200,-150 C 200,-175 200,-200 200,-200",
              "M -200,-200 C -150,-250 -50,-250 0,-200 C 50,-150 100,-50 50,0 C 0,50 -100,100 -150,50 C -200,0 -250,-100 -200,-150 C -200,-175 -200,-200 -200,-200"
            ],
            scale: [1, 1.2, 0.9, 1],
            rotate: [0, 120, 240, 360]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.33, 0.66, 1]
          }}
        />
        <motion.path
          initial={{
            d: "M -150,150 C -100,100 0,100 50,150 C 100,200 150,300 100,350 C 50,400 -50,450 -100,400 C -150,350 -200,250 -150,200 C -150,175 -150,150 -150,150"
          }}
          fill="url(#gradient2)"
          filter="url(#blur)"
          animate={{
            d: [
              "M -150,150 C -100,100 0,100 50,150 C 100,200 150,300 100,350 C 50,400 -50,450 -100,400 C -150,350 -200,250 -150,200 C -150,175 -150,150 -150,150",
              "M 300,0 C 350,-50 450,-50 500,0 C 550,50 600,150 550,200 C 500,250 400,300 350,250 C 300,200 250,100 300,50 C 300,25 300,0 300,0",
              "M 75,225 C 125,175 225,175 275,225 C 325,275 375,375 325,425 C 275,475 175,525 125,475 C 75,425 25,325 75,275 C 75,250 75,225 75,225",
              "M -150,150 C -100,100 0,100 50,150 C 100,200 150,300 100,350 C 50,400 -50,450 -100,400 C -150,350 -200,250 -150,200 C -150,175 -150,150 -150,150"
            ],
            scale: [1, 1.1, 0.95, 1],
            rotate: [0, -120, -240, -360]
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.33, 0.66, 1]
          }}
        />
        <motion.path
          initial={{
            d: "M 150,-150 C 200,-200 300,-200 350,-150 C 400,-100 450,0 400,50 C 350,100 250,150 200,100 C 150,50 100,-50 150,-100 C 150,-125 150,-150 150,-150"
          }}
          fill="url(#gradient3)"
          filter="url(#blur)"
          animate={{
            d: [
              "M 150,-150 C 200,-200 300,-200 350,-150 C 400,-100 450,0 400,50 C 350,100 250,150 200,100 C 150,50 100,-50 150,-100 C 150,-125 150,-150 150,-150",
              "M -225,75 C -175,25 -75,25 -25,75 C 25,125 75,225 25,275 C -25,325 -125,375 -175,325 C -225,275 -275,175 -225,125 C -225,100 -225,75 -225,75",
              "M 375,225 C 425,175 525,175 575,225 C 625,275 675,375 625,425 C 575,475 475,525 425,475 C 375,425 325,325 375,275 C 375,250 375,225 375,225",
              "M 150,-150 C 200,-200 300,-200 350,-150 C 400,-100 450,0 400,50 C 350,100 250,150 200,100 C 150,50 100,-50 150,-100 C 150,-125 150,-150 150,-150"
            ],
            scale: [1, 1.15, 0.9, 1],
            rotate: [0, 180, 360, 540]
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.33, 0.66, 1]
          }}
        />
        <motion.path
          initial={{
            d: "M 300,300 C 350,250 450,250 500,300 C 550,350 600,450 550,500 C 500,550 400,600 350,550 C 300,500 250,400 300,350 C 300,325 300,300 300,300"
          }}
          fill="url(#gradient4)"
          filter="url(#blur)"
          animate={{
            d: [
              "M 300,300 C 350,250 450,250 500,300 C 550,350 600,450 550,500 C 500,550 400,600 350,550 C 300,500 250,400 300,350 C 300,325 300,300 300,300",
              "M -75,75 C -25,25 75,25 125,75 C 175,125 225,225 175,275 C 125,325 25,375 -25,325 C -75,275 -125,175 -75,125 C -75,100 -75,75 -75,75",
              "M 225,-75 C 275,-125 375,-125 425,-75 C 475,-25 525,75 475,125 C 425,175 325,225 275,175 C 225,125 175,25 225,-25 C 225,-50 225,-75 225,-75",
              "M 300,300 C 350,250 450,250 500,300 C 550,350 600,450 550,500 C 500,550 400,600 350,550 C 300,500 250,400 300,350 C 300,325 300,300 300,300"
            ],
            scale: [1, 1.1, 0.95, 1],
            rotate: [0, -180, -360, -540]
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.33, 0.66, 1]
          }}
        />
        <motion.path
          initial={{
            d: "M 0,0 C 50,-50 150,-50 200,0 C 250,50 300,150 250,200 C 200,250 100,300 50,250 C 0,200 -50,100 0,50 C 0,25 0,0 0,0"
          }}
          fill="url(#gradient5)"
          filter="url(#blur)"
          animate={{
            d: [
              "M 0,0 C 50,-50 150,-50 200,0 C 250,50 300,150 250,200 C 200,250 100,300 50,250 C 0,200 -50,100 0,50 C 0,25 0,0 0,0",
              "M 450,150 C 500,100 600,100 650,150 C 700,200 750,300 700,350 C 650,400 550,450 500,400 C 450,350 400,250 450,200 C 450,175 450,150 450,150",
              "M 150,300 C 200,250 300,250 350,300 C 400,350 450,450 400,500 C 350,550 250,600 200,550 C 150,500 100,400 150,350 C 150,325 150,300 150,300",
              "M 0,0 C 50,-50 150,-50 200,0 C 250,50 300,150 250,200 C 200,250 100,300 50,250 C 0,200 -50,100 0,50 C 0,25 0,0 0,0"
            ],
            scale: [1, 1.3, 0.8, 1],
            rotate: [0, 240, 480, 720]
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.33, 0.66, 1]
          }}
        />
        <motion.path
          initial={{
            d: "M -225,-225 C -175,-275 -75,-275 -25,-225 C 25,-175 75,-75 25,-25 C -25,25 -125,75 -175,25 C -225,-25 -275,-125 -225,-175 C -225,-200 -225,-225 -225,-225"
          }}
          fill="url(#gradient6)"
          filter="url(#blur)"
          animate={{
            d: [
              "M -225,-225 C -175,-275 -75,-275 -25,-225 C 25,-175 75,-75 25,-25 C -25,25 -125,75 -175,25 C -225,-25 -275,-125 -225,-175 C -225,-200 -225,-225 -225,-225",
              "M 525,75 C 575,25 675,25 725,75 C 775,125 825,225 775,275 C 725,325 625,375 575,325 C 525,275 475,175 525,125 C 525,100 525,75 525,75",
              "M 75,375 C 125,325 225,325 275,375 C 325,425 375,525 325,575 C 275,625 175,675 125,625 C 75,575 25,475 75,425 C 75,400 75,375 75,375",
              "M -225,-225 C -175,-275 -75,-275 -25,-225 C 25,-175 75,-75 25,-25 C -25,25 -125,75 -175,25 C -225,-25 -275,-125 -225,-175 C -225,-200 -225,-225 -225,-225"
            ],
            scale: [1, 1.25, 0.85, 1],
            rotate: [0, -240, -480, -720]
          }}
          transition={{
            duration: 55,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.33, 0.66, 1]
          }}
        />
      </svg>
    </div>
  );
}

export default memo(AnimatedBackground); 