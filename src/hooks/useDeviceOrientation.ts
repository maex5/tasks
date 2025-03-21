import { useState, useEffect } from 'react';

interface DeviceOrientation {
  beta: number | null;  // Front-to-back tilt in degrees, ranging from -180 to 180
  gamma: number | null; // Left-to-right tilt in degrees, ranging from -90 to 90
}

// Extend the DeviceOrientationEvent interface for iOS
interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
}

interface DeviceOrientationEventStatic extends EventTarget {
  requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
}

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<DeviceOrientation>({
    beta: null,
    gamma: null,
  });

  useEffect(() => {
    // Check if the device supports DeviceOrientationEvent
    if (!window.DeviceOrientationEvent) {
      console.log('Device orientation not supported');
      return;
    }

    // Request permission for iOS devices
    const requestPermission = async () => {
      const DeviceOrientationEvent = window.DeviceOrientationEvent as unknown as DeviceOrientationEventStatic;
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission !== 'granted') {
            console.log('Permission not granted');
            return;
          }
        } catch (error) {
          console.error('Error requesting device orientation permission:', error);
          return;
        }
      }
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        beta: event.beta,
        gamma: event.gamma,
      });
    };

    // Request permission and add event listener
    requestPermission().then(() => {
      window.addEventListener('deviceorientation', handleOrientation, true);
    });

    // Cleanup
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  return orientation;
} 