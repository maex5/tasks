import { useState, useEffect, useCallback } from 'react';

interface DeviceOrientation {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
}

interface UseDeviceOrientationResult {
  orientation: DeviceOrientation;
  requestPermission: () => Promise<boolean>;
  permissionState: 'granted' | 'denied' | 'prompt';
}

// Add iOS-specific types
interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied' | 'prompt'>;
}

type DeviceOrientationStatic = {
  new(type: string, eventInitDict?: DeviceOrientationEventInit): DeviceOrientationEvent;
  requestPermission?: () => Promise<'granted' | 'denied' | 'prompt'>;
}

export function useDeviceOrientation(): UseDeviceOrientationResult {
  const [orientation, setOrientation] = useState<DeviceOrientation>({
    alpha: null,
    beta: null,
    gamma: null
  });
  const [permissionState, setPermissionState] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    setOrientation({
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma
    });
  }, []);

  const requestPermission = useCallback(async () => {
    const DeviceOrientationEvent = window.DeviceOrientationEvent as unknown as DeviceOrientationStatic;
    
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        setPermissionState(permission);
        
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
          return true;
        }
        return false;
      } catch (err) {
        console.error('Error requesting device orientation permission:', err);
        setPermissionState('denied');
        return false;
      }
    } else {
      // For non-iOS devices or when permission is not required
      window.addEventListener('deviceorientation', handleOrientation);
      setPermissionState('granted');
      return true;
    }
  }, [handleOrientation]);

  useEffect(() => {
    const DeviceOrientationEvent = window.DeviceOrientationEvent as unknown as DeviceOrientationStatic;
    
    // Check if we need to request permission (iOS 13+)
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // We'll wait for user interaction to request permission
      return;
    } else {
      // For non-iOS devices or older iOS versions
      window.addEventListener('deviceorientation', handleOrientation);
      setPermissionState('granted');
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [handleOrientation]);

  return {
    orientation,
    requestPermission,
    permissionState
  };
} 