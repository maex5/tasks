import { useState, useEffect } from 'react';

interface DeviceOrientation {
  beta: number | null;  // Front-to-back tilt in degrees, ranging from -180 to 180
  gamma: number | null; // Left-to-right tilt in degrees, ranging from -90 to 90
}

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<DeviceOrientation>({
    beta: null,
    gamma: null,
  });

  useEffect(() => {
    // Handle mouse movement simulation
    const handleMouseMove = (e: MouseEvent) => {
      const fakeGamma = ((e.clientX / window.innerWidth) - 0.5) * 180; // -90 to 90
      const fakeBeta = ((e.clientY / window.innerHeight) - 0.5) * 180; // -90 to 90

      setOrientation({
        beta: fakeBeta,
        gamma: fakeGamma,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return orientation;
} 