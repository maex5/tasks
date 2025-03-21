import { useState, useEffect } from 'react';

interface DeviceOrientation {
  beta: number | null;  // Front-to-back tilt in degrees, ranging from -180 to 180
  gamma: number | null; // Left-to-right tilt in degrees, ranging from -90 to 90
}

type DeviceOrientationEventiOS = {
  requestPermission: () => Promise<'granted' | 'denied' | 'default'>;
};

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<DeviceOrientation>({
    beta: null,
    gamma: null,
  });

  useEffect(() => {
    let isUsingMouse = false;

    // Handle device orientation
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta !== null && event.gamma !== null) {
        setOrientation({
          beta: event.beta,
          gamma: event.gamma,
        });
      }
    };

    // Handle mouse movement simulation (desktop only)
    const handleMouseMove = (e: MouseEvent) => {
      if (!isUsingMouse) return;
      const fakeGamma = ((e.clientX / window.innerWidth) - 0.5) * 180;
      const fakeBeta = ((e.clientY / window.innerHeight) - 0.5) * 180;

      setOrientation({
        beta: fakeBeta,
        gamma: fakeGamma,
      });
    };

    // Setup orientation handling
    const setupOrientation = async () => {
      // Check if this is a mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile && window.DeviceOrientationEvent) {
        // Handle iOS permission
        if (typeof (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS).requestPermission === 'function') {
          try {
            const permission = await (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS).requestPermission();
            if (permission === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
            }
          } catch (error) {
            isUsingMouse = true;
          }
        } else {
          // Non-iOS mobile devices
          window.addEventListener('deviceorientation', handleOrientation);
        }
      } else {
        // Desktop devices use mouse movement
        isUsingMouse = true;
      }
    };

    // Initialize
    setupOrientation();
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return orientation;
} 