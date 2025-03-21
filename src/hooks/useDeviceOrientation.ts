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
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta !== null && event.gamma !== null) {
        setOrientation({
          beta: event.beta,
          gamma: event.gamma,
        });
      }
    };

    const setupOrientation = async () => {
      // Check if we need to request permission (iOS)
      const requestPermission = async () => {
        if (typeof (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS).requestPermission === 'function') {
          const permission = await (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS).requestPermission();
          return permission === 'granted';
        }
        return true; // Non-iOS devices don't need permission
      };

      try {
        const permissionGranted = await requestPermission();
        if (permissionGranted) {
          window.addEventListener('deviceorientation', handleOrientation);
        }
      } catch (error) {
        console.error('Error setting up device orientation:', error);
      }
    };

    setupOrientation();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return orientation;
} 