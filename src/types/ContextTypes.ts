/**
 * Context Types
 * Types for React Context providers and their state
 */

import { Device, DevicePermissions } from './DeviceTypes';
import { SideBarMode, RaisedHandParticipant } from './MeetingTypes';

export interface MeetingAppContextType {
  // Device State
  selectedMic: Device;
  selectedWebcam: Device;
  selectedSpeaker: Device;
  setSelectedMic: (device: Device) => void;
  setSelectedWebcam: (device: Device) => void;
  setSelectedSpeaker: (device: Device) => void;

  // Permissions
  isCameraPermissionAllowed: boolean | null;
  isMicrophonePermissionAllowed: boolean | null;
  setIsCameraPermissionAllowed: (allowed: boolean | null) => void;
  setIsMicrophonePermissionAllowed: (allowed: boolean | null) => void;

  // UI State
  sideBarMode: SideBarMode;
  setSideBarMode: (mode: SideBarMode) => void;
  pipMode: boolean;
  setPipMode: (enabled: boolean) => void;

  // Participants State
  raisedHandsParticipants: RaisedHandParticipant[];
  setRaisedHandsParticipants: (participants: RaisedHandParticipant[]) => void;

  // Hooks
  useRaisedHandParticipants: () => {
    participantRaisedHand: (participantId: string) => void;
  };
}

export interface MeetingAppProviderProps {
  children: React.ReactNode;
}
