/**
 * Device Types
 * Types related to media devices (microphone, webcam, speaker)
 */

export interface Device {
  id: string | null;
  label: string | null;
}

export interface MediaDeviceInfo {
  deviceId: string;
  groupId: string;
  kind: 'audioinput' | 'audiooutput' | 'videoinput';
  label: string;
}

export interface DevicePermissions {
  camera: boolean | null;
  microphone: boolean | null;
}

export interface CustomMediaStream {
  stream: MediaStream | null;
  track: MediaStreamTrack | null;
}
