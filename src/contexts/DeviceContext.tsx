/**
 * Device Context
 * Manages media device state (microphone, webcam, speaker)
 */

import { createContext, useContext, useState } from 'react';
import type { Device } from '../types';

interface DeviceContextType {
  selectedMic: Device;
  selectedWebcam: Device;
  selectedSpeaker: Device;
  setSelectedMic: (device: Device) => void;
  setSelectedWebcam: (device: Device) => void;
  setSelectedSpeaker: (device: Device) => void;
  isCameraPermissionAllowed: boolean | null;
  isMicrophonePermissionAllowed: boolean | null;
  setIsCameraPermissionAllowed: (allowed: boolean | null) => void;
  setIsMicrophonePermissionAllowed: (allowed: boolean | null) => void;
}

interface DeviceProviderProps {
  children: React.ReactNode;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const useDeviceContext = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDeviceContext must be used within DeviceProvider');
  }
  return context;
};

export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
  const [selectedMic, setSelectedMic] = useState<Device>({ id: null, label: null });
  const [selectedWebcam, setSelectedWebcam] = useState<Device>({ id: null, label: null });
  const [selectedSpeaker, setSelectedSpeaker] = useState<Device>({ id: null, label: null });
  const [isCameraPermissionAllowed, setIsCameraPermissionAllowed] = useState<boolean | null>(null);
  const [isMicrophonePermissionAllowed, setIsMicrophonePermissionAllowed] = useState<boolean | null>(null);

  return (
    <DeviceContext.Provider
      value={{
        selectedMic,
        selectedWebcam,
        selectedSpeaker,
        setSelectedMic,
        setSelectedWebcam,
        setSelectedSpeaker,
        isCameraPermissionAllowed,
        isMicrophonePermissionAllowed,
        setIsCameraPermissionAllowed,
        setIsMicrophonePermissionAllowed,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};
